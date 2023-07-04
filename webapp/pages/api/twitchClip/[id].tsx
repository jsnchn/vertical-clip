// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const twitch_client_id = process.env.TWITCH_CLIENT_ID;
const twitch_secret = process.env.TWITCH_CLIENT_SECRET;
let twitch_auth_url = new URL("https://id.twitch.tv/oauth2/token");

const handlers: any = {
  async get(req: any, res: any) {
    const {
      query: { id },
    } = req;

    const params = [
      ["client_id", twitch_client_id ?? ""],
      ["client_secret", twitch_secret ?? ""],
      ["grant_type", "client_credentials"],
    ];
    twitch_auth_url.search = new URLSearchParams(params).toString();

    const resp = await fetch(twitch_auth_url.toString(), {
      method: "POST",
    });
    console.log(resp);
    const resp_json = await resp.json();
    let clip_url = new URL("https://api.twitch.tv/helix/clips");
    const clip_url_params = [["id", id]];
    clip_url.search = new URLSearchParams(clip_url_params).toString();
    console.log(clip_url);
    const token = resp_json["access_token"];
    console.log("Token: ", token);
    const clip = await fetch(clip_url.toString(), {
      method: "GET",
      headers: {
        "client-id": twitch_client_id ?? "",
        Authorization: "Bearer " + token,
      },
    });
    const clip_data = await clip.json();
    console.log(clip_data);
    const mp4_url = clip_data.data[0].thumbnail_url.split("-preview")[0];
    return res.json({ message: "Clip mp4 fetched", data: mp4_url + ".mp4" });
  },
};

export default (req: any, res: any) => {
  const execute = handlers[req.method.toLowerCase()];
  return execute(req, res);
};
