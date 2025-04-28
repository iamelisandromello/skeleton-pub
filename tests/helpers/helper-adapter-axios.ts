import axios from 'axios'

export const mockAxiosRequest = () => {
  return jest.spyOn(axios, 'request') as jest.Mock
}
