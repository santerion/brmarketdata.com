import { Button } from "./button"

interface CardTechnologyProps {
  technology: string
}

export function CardTechnology({ technology }: CardTechnologyProps) {
  return (
    <Button variant="outline" className="flex-1 min-w-[8rem] max-w-[8rem] text-center text-xs">
        <span className="cursor-default text-gray-700 dark:text-gray-300">{technology}</span>
    </Button>
  )
}