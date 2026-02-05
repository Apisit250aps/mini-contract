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
          message: 'Validation Error',
          error: validation.error,
        },
        { status: 400 },
      )
    }

    const contract = await createContract(validation.data)

    return NextResponse.json({
      success: true,
      message: 'Contract created successfully',
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

async function UpdateContract(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Contract>>> {
  try {
    const data = await req.json()
    const { id } = await params
    //
    const contract = await getContractById(id)
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
    const updatedContract = await updateContract(id, validation.data)
    if (!updatedContract) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update contract',
          error: 'Update Error',
        },
        { status: 500 },
      )
    }
    return NextResponse.json({
      success: true,
      message: 'Contract updated successfully',
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
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params
    const contract = await getContractById(id)
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

    const deleted = await deleteContract(id)
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to delete contract',
          error: 'Delete Error',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contract deleted successfully',
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
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Contract>>> {
  try {
    const { id } = await params
    const contract = await getContractById(id)
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
      message: 'Contract fetched successfully',
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function ListContracts(_: NextRequest): Promise<NextResponse<ApiResponse<Contract[]>>> {
  try {
    const contracts = await getContracts()
    return NextResponse.json({
      success: true,
      message: 'Contracts fetched successfully',
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

export { CreateContract, UpdateContract, DeleteContract, GetContract, ListContracts }

