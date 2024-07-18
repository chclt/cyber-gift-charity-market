export async function createGift(file: File) {
    return fetch("/api/gift", {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("file", file);
          return formData;
        })()
      })
      .then(async res => {
        if (res.ok) {
          const json = await res.json();
          console.log(`${json.data.cid}`);
        }
    })
}