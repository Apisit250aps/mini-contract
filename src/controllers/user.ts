import { safeValidate } from '@/lib/utils'
import { BaseUser, User } from '@/models/entities/user'
import { createUser, getUserByName } from '@/models/repositories/user'
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

export { CreateUser }
