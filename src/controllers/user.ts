import { safeValidate } from '@/lib/utils'
import { BaseUser, User } from '@/models/entities/user'
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  getUserByName,
  updateUser,
} from '@/models/repositories/user'
import { NextRequest, NextResponse } from 'next/server'

async function CreateUser(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const data = await req.json()
    const validation = await safeValidate(
      BaseUser.pick({
        name: true,
        password: true,
        isActive: true,
      }),
      data,
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
    const exists = await getUserByName(validation.data.name)
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username already exists',
          error: 'Duplicate username',
        },
        { status: 409 },
      )
    }

    const user = await createUser(validation.data)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: user,
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

async function UpdateUser(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const data = await req.json()
    const { id } = await params
    //
    const user = await getUserById(id)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
          error: 'Not Found',
        },
        { status: 404 },
      )
    }
    const validation = await safeValidate(
      BaseUser.omit({
        id: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      }).partial(),
      data,
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
    const updated = await updateUser(id, validation.data)
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updated,
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

async function DeleteUser(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params
    const user = await getUserById(id)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
          error: 'Not Found',
        },
        { status: 404 },
      )
    }

    await deleteUser(id)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
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

async function GetUser(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const { id } = await params
    const user = await getUserById(id)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
          error: 'Not Found',
        },
        { status: 404 },
      )
    }
    return NextResponse.json({
      success: true,
      message: 'User fetched successfully',
      data: user,
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
async function ListUsers(_: NextRequest): Promise<NextResponse<ApiResponse<User[]>>> {
  try {
    const users = await getAllUser()
    return NextResponse.json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
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

export { CreateUser, UpdateUser, DeleteUser, GetUser, ListUsers }
