import * as fs from 'fs'
import * as path from 'path'
import { AragonAppJson } from '~/src/types'

const arappPath = 'arapp.json'
const contractsPath = './contracts'

/**
 * Reads and parses an arapp.json file.
 * @return AragonAppJson
 */
export function readArapp(): AragonAppJson {
  return JSON.parse(fs.readFileSync(arappPath, 'utf-8'))
}

/**
 * Returns app ens name.
 * @return "voting.open.aragonpm.eth"
 */
export function getAppEnsName(): string {
  const arapp = readArapp()

  const defaultEnvironment = arapp.environments.default
  if (!defaultEnvironment) {
    throw new Error('Default environemnt not found in arapp.json')
  }

  return defaultEnvironment.appName
}

/**
 * Returns app name.
 * @return "voting"
 */
export function getAppName(): string {
  const ensName = getAppEnsName()

  return ensName.split('.')[0]
}

/**
 * Returns main contract path.
 * @return "./contracts/Counter.sol"
 */
export function getMainContractPath(): string {
  // Read the path from arapp.json.
  if (fs.existsSync(arappPath)) {
    const arapp = readArapp()

    return arapp.path
  }

  // Try to guess contract path.
  if (fs.existsSync(contractsPath)) {
    const contracts: string[] = fs.readdirSync(contractsPath)

    const candidates: string[] = contracts.filter(
      name => name.endsWith('.sol') || name !== 'Imports.sol'
    )

    if (candidates.length === 1) {
      return path.join(contractsPath, candidates[0])
    }
  }

  throw Error(`Unable to find main contract path.`)
}

/**
 * Returns main contract name.
 * @return "Counter"
 */
export function getMainContractName(): string {
  const mainContractPath: string = getMainContractPath()
  return path.parse(mainContractPath).name
}
