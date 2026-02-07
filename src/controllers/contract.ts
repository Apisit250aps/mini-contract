import { NextRequest, NextResponse } from 'next/server'
import { safeValidate } from '@/lib/utils'
import { BaseContract, Contract } from '@/models/entities/contract'
import {
  createContract,
  deleteContract,
  getContracts,
  getContractById,
  updateContract,
} from '@/models/repositories/contract'

type ContractParams = { contractId: string }

async function CreateContract(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<Contract>>> {
  try {
    const data = await req.json()
    const validation = await safeValidate(
      BaseContract.omit({ id: true, createdAt: true, updatedAt: true }).extend({
        startDate: BaseContract.shape.startDate.optional(),
        endDate: BaseContract.shape.endDate.optional(),
        workers: BaseContract.shape.workers.optional(),
        size: BaseContract.shape.size.optional(),
      }),
      {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
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

    const contract = await createContract(validation.data)

    return NextResponse.json({
      success: true,
      message: 'สร้างสัญญาสำเร็จ',
      data: contract,
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

async function UpdateContract(
  req: NextRequest,
  { params }: { params: Promise<ContractParams> },
): Promise<NextResponse<ApiResponse<Contract>>> {
  try {
    const data = await req.json()
    const { contractId } = await params
    //
    const contract = await getContractById(contractId)
    if (!contract) {
      return NextResponse.json(
        {
          success: false,
          message: 'ไม่พบสัญญา',
          error: 'ไม่พบข้อมูล',
        },
        { status: 404 },
      )
    }
    const validation = await safeValidate(
      BaseContract.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      }).partial(),
      {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    )
    if (validation.error || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation Error',
          error: validation.error,
        },
        { status: 400 },
      )
    }
    const updatedContract = await updateContract(contractId, validation.data)
    if (!updatedContract) {
      return NextResponse.json(
        {
          success: false,
            message: 'ไม่สามารถอัปเดตสัญญาได้',
            error: 'ข้อผิดพลาดในการอัปเดต',
        },
        { status: 500 },
      )
    }
    return NextResponse.json({
      success: true,
      message: 'อัปเดตสัญญาสำเร็จ',
      data: updatedContract,
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

async function DeleteContract(
  _req: NextRequest,
  { params }: { params: Promise<ContractParams> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { contractId } = await params
    const contract = await getContractById(contractId)
    if (!contract) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contract not found',
          error: 'Not Found',
        },
        { status: 404 },
      )
    }

    const deleted = await deleteContract(contractId)
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
            message: 'ไม่สามารถลบสัญญาได้',
            error: 'ข้อผิดพลาดในการลบ',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'ลบสัญญาสำเร็จ',
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

async function GetContract(
  _req: NextRequest,
  { params }: { params: Promise<ContractParams> },
): Promise<NextResponse<ApiResponse<Contract>>> {
  try {
    const { contractId } = await params
    const contract = await getContractById(contractId)
    if (!contract) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contract not found',
          error: 'Not Found',
        },
        { status: 404 },
      )
    }
    return NextResponse.json({
      success: true,
      message: 'ดึงข้อมูลสัญญาสำเร็จ',
      data: contract,
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

async function ListContracts(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest,
): Promise<NextResponse<ApiResponse<Contract[]>>> {
  try {
    const contracts = await getContracts()
    return NextResponse.json({
      success: true,
      message: 'ดึงข้อมูลสัญญาทั้งหมดสำเร็จ',
      data: contracts,
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

export {
  CreateContract,
  UpdateContract,
  DeleteContract,
  GetContract,
  ListContracts,
}
