import { safeValidate } from '@/lib/utils'
import { zodTimeStamp } from '@/lib/zod/field'
import { BaseCheck, type Check } from '@/models/entities/check'
import { createCheck } from '@/models/repositories/check'
import { NextRequest, NextResponse } from 'next/server'

type CheckParams = {
  contractId: string
}

export async function CreateCheck(
  req: NextRequest,
  { params }: { params: Promise<CheckParams> },
): Promise<NextResponse<ApiResponse<Check>>> {
  try {
    const { contractId } = await params
    const data = await req.json()
    const parsed = await safeValidate(
      BaseCheck.extend({
        createdAt: zodTimeStamp(),
        updatedAt: zodTimeStamp(),
      }),
      { ...data, contractId },
    )
    if (parsed.error || !parsed.data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation Error',
          error: parsed.error,
        },
        { status: 400 },
      )
    }
    const checked = await createCheck({
      ...parsed.data,
    })
    return NextResponse.json({
      success: true,
      message: 'Check created successfully',
      data: checked,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
