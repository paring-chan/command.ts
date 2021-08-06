import { IPty } from 'node-pty'

export const shellInstances: {
  name: string
  pty: IPty
}[] = []
