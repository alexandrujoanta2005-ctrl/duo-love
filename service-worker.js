const CACHE_VERSION = "duo-love-v73";

const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;


/* =========================================================
   PAGINI PWA
========================================================= */

const PAGE_FILES = [
  "./",
  "./index.html",
  "./animale.html",
  "./camera-animal.html",
  "./magazin-animal.html",
  "./misiuni-animal.html",
  "./login.html",
  "./chat.html",
  "./harta.html",
  "./amintiri.html",
  "./evenimente.html",
  "./love-studio.html",
  "./capsula-timpului.html",
  "./mesaje.html",
  "./setari.html",
  "./despre-noi.html",
  "./date.html",
  "./recompense.html"
];


/* =========================================================
   FIȘIERE STATICE
========================================================= */

const STATIC_FILES = [
  "./style.css",
  "./setari.css",

  "./supabase.js",
  "./cloud-sync.js",
  "./reward-effects.js",
  "./tema.js",
  "./ursulet.js",
  "./pet-system.js",
  "./duo-media.js",

  "./chat.js",
  "./amintiri.js",
  "./evenimente.js",
  "./mesaje.js",
  "./self.js",
  "./setari.js",
  "./recompense.js",

  "./manifest.json",

  "./icon-192.png",
  "./icon-512.png",
  "./maskable-icon-512.png",
  "./apple-touch-icon.png",

  "./ursulet.png",
  "./animal-dog-real.png",
  "./animal-cat-real.png",
];


/* =========================================================
   VERIFICĂ DACĂ RĂSPUNSUL POATE FI CACHE-UIT
========================================================= */

function canCacheResponse(
  response
) {

  return Boolean(
    response &&
    (
      response.ok ||
      response.type === "opaque"
    )
  );

}


/* =========================================================
   CACHE FIȘIERE UNUL CÂTE UNUL
========================================================= */

async function cacheFilesOneByOne(
  cacheName,
  files
) {

  const cache =
    await caches.open(
      cacheName
    );


  await Promise.allSettled(

    files.map(
      async file => {

        try {

          const request =
            new Request(
              file,
              {
                cache:
                  "reload"
              }
            );


          const response =
            await fetch(
              request
            );


          if (
            canCacheResponse(
              response
            )
          ) {

            await cache.put(
              file,
              response
            );

          }

        } catch (error) {

        }

      }
    )

  );

}


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      Promise.all([

        cacheFilesOneByOne(
          PAGE_CACHE,
          PAGE_FILES
        ),

        cacheFilesOneByOne(
          STATIC_CACHE,
          STATIC_FILES
        )

      ])

    );


    self.skipWaiting();

  }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys =>

            Promise.all(

              keys
                .filter(
                  key =>
                    !key.startsWith(
                      CACHE_VERSION
                    )
                )
                .map(
                  key =>
                    caches.delete(
                      key
                    )
                )

            )

        )

    );


    self.clients.claim();

  }
);


/* =========================================================
   PAGINI HTML
========================================================= */

async function fastPage(
  request
) {

  const cache =
    await caches.open(
      PAGE_CACHE
    );


  const cached =
    await cache.match(
      request
    );


  const networkPromise =
    fetch(
      request
    )
      .then(
        async response => {

          if (
            canCacheResponse(
              response
            )
          ) {

            await cache.put(
              request,
              response.clone()
            );

          }


          return response;

        }
      )
      .catch(
        () =>
          null
      );


  if (
    cached
  ) {

    networkPromise.catch(
      () => {}
    );


    return cached;

  }


  const networkResponse =
    await networkPromise;


  if (
    networkResponse
  ) {

    return networkResponse;

  }


  const fallback =
    await cache.match(
      "./index.html"
    );


  if (
    fallback
  ) {

    return fallback;

  }


  return new Response(
    "Offline",
    {
      status:
        503,

      headers: {
        "Content-Type":
          "text/plain; charset=UTF-8"
      }
    }
  );

}


/* =========================================================
   JS / CSS / FONT
========================================================= */

async function staleWhileRevalidate(
  request
) {

  const cache =
    await caches.open(
      STATIC_CACHE
    );


  const cached =
    (
      await cache.match(
        request
      )
    ) ||
    (
      await cache.match(
        request,
        {
          ignoreSearch:
            true
        }
      )
    );


  const networkPromise =
    fetch(
      request
    )
      .then(
        async response => {

          if (
            canCacheResponse(
              response
            )
          ) {

            await cache.put(
              request,
              response.clone()
            );

          }


          return response;

        }
      )
      .catch(
        () =>
          null
      );


  if (
    cached
  ) {

    networkPromise.catch(
      () => {}
    );


    return cached;

  }


  const response =
    await networkPromise;


  if (
    response
  ) {

    return response;

  }


  return new Response(
    "",
    {
      status:
        504
    }
  );

}


/* =========================================================
   IMAGINI
========================================================= */

async function imageCacheFirst(
  request
) {

  const cache =
    await caches.open(
      IMAGE_CACHE
    );


  const cached =
    await cache.match(
      request
    );


  if (
    cached
  ) {

    return cached;

  }


  try {

    const response =
      await fetch(
        request
      );


    if (
      canCacheResponse(
        response
      )
    ) {

      await cache.put(
        request,
        response.clone()
      );

    }


    return response;

  } catch (error) {

    return new Response(
      "",
      {
        status:
          404
      }
    );

  }

}


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
  "fetch",
  event => {

    const request =
      event.request;


    if (
      request.method !==
      "GET"
    ) {

      return;

    }


    const url =
      new URL(
        request.url
      );


    /* Love AI are propriul service worker și propriul cache.
       Nu interceptăm subfolderul din service worker-ul DUO LOVE. */
    if (
      url.pathname.includes(
        "/love-ai/"
      )
    ) {

      return;

    }


    if (
      url.hostname.includes(
        "supabase.co"
      )
    ) {

      return;

    }


    /*
      Tile-urile OpenStreetMap sunt numeroase și se schimbă în funcție
      de zona/zoom-ul vizualizat. Nu le păstrăm în cache-ul PWA,
      ca să nu umple memoria dispozitivului.
    */
    if (
      url.hostname === "tile.openstreetmap.org" ||
      url.hostname.endsWith(".tile.openstreetmap.org")
    ) {

      return;

    }


    if (
      request.mode ===
        "navigate"

      ||

      request.destination ===
        "document"
    ) {

      event.respondWith(
        fastPage(
          request
        )
      );


      return;

    }


    if (
      request.destination ===
      "image"
    ) {

      event.respondWith(
        imageCacheFirst(
          request
        )
      );


      return;

    }


    if (
      request.destination ===
        "script"

      ||

      request.destination ===
        "style"

      ||

      request.destination ===
        "font"
    ) {

      event.respondWith(
        staleWhileRevalidate(
          request
        )
      );

    }

  }
);


/* =========================================================
   MESAJ DIN APLICAȚIE
========================================================= */

self.addEventListener(
  "message",
  event => {

    const data =
      event.data ||
      {};


    if (
      data.type ===
      "SKIP_WAITING"
    ) {

      self.skipWaiting();

      return;

    }


    if (
      data.type ===
      "TEST_NOTIFICATION"
    ) {

      event.waitUntil(

        self.registration
          .showNotification(

            data.title ||
            "Povestea Noastră ❤️",

            {

              body:
                data.body ||
                "Notificările funcționează. ❤️",

              icon:
                "./icon-192.png",

              badge:
                "./icon-192.png",

              tag:
                "duo-love-test",

              data: {

                url:
                  data.url ||
                  "./index.html"

              }

            }

          )

      );

    }

  }
);


/* =========================================================
   PUSH NOTIFICATION
========================================================= */

self.addEventListener(
  "push",
  event => {

    let data = {

      title:
        "Povestea Noastră ❤️",

      body:
        "Ai ceva nou.",

      url:
        "./index.html",

      tag:
        "duo-love-push"

    };


    try {

      if (
        event.data
      ) {

        const incoming =
          event.data.json();


        if (
          incoming &&
          typeof incoming ===
          "object"
        ) {

          data = {

            ...data,
            ...incoming

          };

        }

      }

    } catch (error) {

      if (
        event.data
      ) {

        data.body =
          event.data.text();

      }

    }


    event.waitUntil(

      self.registration
        .showNotification(

          data.title ||
          "Povestea Noastră ❤️",

          {

            body:
              data.body ||
              "",

            icon:
              "./icon-192.png",

            badge:
              "./icon-192.png",

            tag:
              data.tag ||
              "duo-love-push",

            renotify:
              true,

            data: {

              url:
                data.url ||
                "./index.html"

            }

          }

        )

    );

  }
);


/* =========================================================
   CLICK PE NOTIFICARE
========================================================= */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();


    const target =
      event.notification
        .data
        ?.url ||
      "./index.html";


    event.waitUntil(

      self.clients
        .matchAll(
          {

            type:
              "window",

            includeUncontrolled:
              true

          }
        )
        .then(
          async windows => {

            for (
              const client
              of windows
            ) {

              if (
                "focus" in client
              ) {

                if (
                  "navigate" in client
                ) {

                  try {

                    await client.navigate(
                      target
                    );

                  } catch (error) {
                  }

                }


                return client.focus();

              }

            }


            return self.clients
              .openWindow(
                target
              );

          }
        )

    );

  }
);