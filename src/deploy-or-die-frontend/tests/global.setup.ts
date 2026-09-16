import {setup as setupTestContainers} from './testcontainers'

export default async function setup() {
   await setupTestContainers();
}