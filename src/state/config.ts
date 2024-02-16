import { selector } from "recoil";
import { ConfigInfo } from "types/config";
import { getConfig } from "utils/config";

export const configInfoState = selector<ConfigInfo>({
  key: "configInfo",
  get: async () => {
    const url = getConfig((config) => config.api.baseUrl);
    const apiKey = getConfig((config) => config.api.apiKey);

    const response = await fetch(`${url}/config/info`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    return <ConfigInfo>{
      name: data.name,
      address: data.address,
      phone: data.phone,
      logo: data.logo,
    }
  },
});
