type StarterListProps = {
  items: string[]
  className?: string
}

export function StarterList({ items, className = 'list-plain' }: StarterListProps) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}