import {teardown as teardownTestContainers} from './testcontainers'

export default async function teardown() {
   await teardownTestContainers();
}