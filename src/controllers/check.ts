import { safeValidate } from '@/lib/utils'
import { zodTimeStamp } from '@/lib/zod/field'
import { BaseCheck, type Check } from '@/models/entities/check'
import {
  createCheck,
  addWorkersToCheck,
  removeWorkersFromCheck,
  getCheckStatistics,
  deleteCheck,
  updateCheck,
} from '@/models/repositories/check'
import { NextRequest, NextResponse } from 'next/server'

export async function CreateCheck(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<Check>>> {
  try {
    const data = await req.json()
    const parsed = await safeValidate(
      BaseCheck.extend({
        createdAt: zodTimeStamp(),
        updatedAt: zodTimeStamp(),
      }),
      { ...data },
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

type CheckUpdateParams = {
  checkId: string
}

export async function AddWorkersToCheck(
  req: NextRequest,
  { params }: { params: Promise<CheckUpdateParams> },
): Promise<NextResponse<ApiResponse<Check>>> {
  try {
    const { checkId } = await params
    const { workerIds } = await req.json()

    const updatedCheck = await addWorkersToCheck(checkId, workerIds)

    if (!updatedCheck) {
      return NextResponse.json(
        {
          success: false,
          message: 'Check not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Workers added to check successfully',
      data: updatedCheck,
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

export async function RemoveWorkersFromCheck(
  req: NextRequest,
  { params }: { params: Promise<CheckUpdateParams> },
): Promise<NextResponse<ApiResponse<Check>>> {
  try {
    const { checkId } = await params
    const { workerIds } = await req.json()

    const updatedCheck = await removeWorkersFromCheck(checkId, workerIds)

    if (!updatedCheck) {
      return NextResponse.json(
        {
          success: false,
          message: 'Check not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Workers removed from check successfully',
      data: updatedCheck,
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

type StatsParams = {
  contractId: string
}

export async function GetCheckStats(
  req: NextRequest,
  { params }: { params: Promise<StatsParams> },
): Promise<
  NextResponse<
    ApiResponse<{
      totalChecks: number
      lastCheckDate: Date | null
      averageWorkersPerCheck: number
    }>
  >
> {
  try {
    const { contractId } = await params

    const stats = await getCheckStatistics(contractId)

    return NextResponse.json({
      success: true,
      message: 'Check statistics retrieved successfully',
      data: stats,
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

export async function UpdateCheck(
  req: NextRequest,
  { params }: { params: Promise<CheckUpdateParams> },
): Promise<NextResponse<ApiResponse<Check>>> {
  try {
    const { checkId } = await params
    const data = await req.json()
    const parsed = await safeValidate(
      BaseCheck.omit({
        id: true,
        workersChecked: true,
        createdAt: true,
      })
        .extend({
          updatedAt: zodTimeStamp(),
        })
        .partial(),
      { ...data },
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
    const updatedCheck = await updateCheck(checkId, parsed.data)
    return NextResponse.json({
      success: true,
      message: 'Check updated successfully',
      data: updatedCheck,
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

export async function DeleteCheck(
  req: NextRequest,
  { params }: { params: Promise<CheckUpdateParams> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { checkId } = await params
    const deleted = await deleteCheck(checkId)
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: 'Check not found',
        },
        { status: 404 },
      )
    }
    return NextResponse.json({
      success: true,
      message: 'Check deleted successfully',
      data: null,
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
