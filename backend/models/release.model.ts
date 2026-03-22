import { AppDataSource } from "../config/db";
import { Release } from "../entities/Release.entity";
import { computeStatus } from "../utils/compute-status";

// Note: Initialization happens in index.ts. We load repo when needed or globally here because index.ts is the entry point
// but we have to be careful with initialization order. Since we use the repo inside methods called *after* server starts, it's fine.
const releaseRepo = AppDataSource.getRepository(Release);

export const ReleaseModel = {
  async create(name: string, release_date: string, additional_info?: string) {
    const steps = [false, false, false, false, false, false, false];
    const status = "planned";

    const release = releaseRepo.create({
      name,
      release_date,
      status,
      steps,
      additional_info,
    });

    return await releaseRepo.save(release);
  },

  async findAll() {
    return await releaseRepo.find({
      order: {
        created_at: "DESC",
      },
    });
  },

  async update(
    id: string,
    name: string,
    release_date: string,
    steps: boolean[],
    additional_info: string,
  ) {
    const status = computeStatus(steps);

    await releaseRepo.update(id, {
      name,
      release_date,
      steps,
      status,
      additional_info,
    });

    return await releaseRepo.findOneBy({ id });
  },

  async delete(id: string) {
    await releaseRepo.delete(id);
  },
};
