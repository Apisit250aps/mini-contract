import ContractDetailView from '@/views/contract-detail-view'
import React from 'react'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ContractDetailView id={id} />
}
