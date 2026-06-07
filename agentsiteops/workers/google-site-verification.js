export default {
  fetch() {
    return new Response(
      "google-site-verification: google9d0c32a95c4ff405.html",
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      },
    );
  },
};
