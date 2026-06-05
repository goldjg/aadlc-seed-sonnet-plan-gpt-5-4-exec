import { describe, expect, it } from '@jest/globals'
import { commands } from './commands'
import * as create from './commands/create'
import * as greeting from './commands/greeting'
import * as info from './commands/info'

describe('index exports', () => {
  it('exports commands array containing info, greeting, and create', () => {
    expect(commands).toHaveLength(3)
    expect(commands).toEqual([info, greeting, create])
  })
})
