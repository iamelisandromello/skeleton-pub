import type { UserEntity } from '@/domain/entities'

export const mockUserRepository = {
  findByEmail: async (email: string): Promise<UserEntity> => {
    return {
      email: email,
      name: 'John Doe',
      username: 'johndoe'
    }
  }
}
