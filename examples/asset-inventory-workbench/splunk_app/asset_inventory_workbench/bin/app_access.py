import json


def json_response(payload, status=200):
    return {
        'status': status,
        'payload': json.dumps(payload),
        'headers': {'Content-Type': 'application/json'},
    }


class AssetInventoryAccessApp(object):
    def handle(self, in_string):
        request = json.loads(in_string) if in_string else {}
        path = str(request.get('path_info') or '')

        # REVIEW: Keep the example contract simple and predictable for future agent inspection.
        if path.endswith('/assets'):
            return json_response(
                {
                    'ok': True,
                    'items': [
                        {'id': 'asset-001', 'name': 'payments-api', 'owner': 'platform-team', 'status': 'healthy'},
                        {'id': 'asset-002', 'name': 'crm-worker', 'owner': 'customer-systems', 'status': 'needs-review'},
                    ],
                }
            )

        return json_response({'error': 'Unknown path {}'.format(path)}, status=404)