import { safeValidate } from '@/lib/utils'
import { BaseWorker } from '@/models/entities/worker'
import {
  createWorker,
  deleteWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
} from '@/models/repositories/worker'
import { NextRequest, NextResponse } from 'next/server'
import type { Worker } from '@/models/entities/worker'

async function CreateWorker(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<Worker>>> {
  try {
    const data = await req.json()
    const parsed = await safeValidate(
      BaseWorker.omit({ id: true, createdAt: true, updatedAt: true }).extend({
        position: BaseWorker.shape.position.optional(),
      }),
      { ...data, hiredAt: data.hiredAt ? new Date(data.hiredAt) : null },
    )
    if (parsed.error || !parsed.data) {
      return NextResponse.json(
        {
          success: false,
          message: 'ข้อมูลไม่ถูกต้อง',
          error: parsed.error,
        },
        { status: 400 },
      )
    }
    const worker = await createWorker({ ...parsed.data })

    return NextResponse.json({
      success: true,
      message: 'สร้างพนักงานสำเร็จ',
      data: worker,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
          message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

async function UpdateWorker(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Worker>>> {
  try {
    const data = await req.json()
    const { id } = await params
    //
    const worker = await getWorkerById(id)
    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          message: 'ไม่พบพนักงาน',
          error: 'ไม่พบข้อมูล',
        },
        { status: 404 },
      )
    }
    const validation = await safeValidate(
      BaseWorker.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      }).partial(),
      { ...data, hiredAt: data.hiredAt ? new Date(data.hiredAt) : null },
    )
    if (validation.error || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          message: 'ข้อมูลไม่ถูกต้อง',
          error: validation.error,
        },
        { status: 400 },
      )
    }
    const updatedWorker = await updateWorker(id, validation.data)
    if (!updatedWorker) {
      return NextResponse.json(
        {
          success: false,
            message: 'ไม่สามารถอัปเดตพนักงานได้',
            error: 'ข้อผิดพลาดในการอัปเดต',
        },
        { status: 500 },
      )
    }
    return NextResponse.json({
      success: true,
      message: 'อัปเดตพนักงานสำเร็จ',
      data: updatedWorker,
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

async function DeleteWorker(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params
    await deleteWorker(id)
    return NextResponse.json({
      success: true,
      message: 'ลบพนักงานสำเร็จ',
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

async function GetWorker(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Worker>>> {
  try {
    const { id } = await params
    const worker = await getWorkerById(id)
    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          message: 'Worker not found',
          error: 'Not Found',
        },
        { status: 404 },
      )
    }
    return NextResponse.json({
      success: true,
      message: 'Worker fetched successfully',
      data: worker,
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

async function GetAllWorkers(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest,
): Promise<NextResponse<ApiResponse<Worker[]>>> {
  try {
    const workers = await getAllWorkers()
    return NextResponse.json({
      success: true,
      message: 'Workers fetched successfully',
      data: workers,
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

export { CreateWorker, UpdateWorker, DeleteWorker, GetWorker, GetAllWorkers }
