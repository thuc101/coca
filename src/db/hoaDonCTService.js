import { createService } from "./baseService";

const baseService = createService("HoaDonCT");

export const hoaDonCTService = {

  ...baseService,

  getByHoaDonId(hoaDonId) {
    return baseService.where(x => x.HoaDonId == hoaDonId);
  },

};

