import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

type PageLayoutProps = {
  children?: React.ReactNode
  description?: string
  title: string
  actions?: React.ReactNode
}

export default function PageLayout({
  children,
  description,
  title,
  actions,
}: PageLayoutProps) {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div>{actions}</div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
