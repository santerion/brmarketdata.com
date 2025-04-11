import { CardTechnology } from "@/components/ui/card-technology"

interface TechnologiesSectionProps {
  technologies: string[]
}

export function TechnologiesSection({ technologies }: TechnologiesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Technologies Used</h2>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <CardTechnology key={index} technology={tech} />
        ))}
      </div>
    </div>
  )
}