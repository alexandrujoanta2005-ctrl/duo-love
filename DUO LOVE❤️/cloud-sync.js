console.log("❤️ DUO LOVE BUILD v18 - CLOUD SYNC");

/* =========================================================
   SINCRONIZARE CONT + CUPLU - SUPABASE
   VARIANTA OPTIMIZATĂ
========================================================= */

const CLOUD_KEYS = [

  "firstName",
  "secondName",
  "relationshipStartDate",
  "coupleQuote",

  "selectedTheme",
  "appFont",
  "appFontSize",

  "couplePhotoPath",

  "loveEvents",
  "loveHistory",

  "loveMemories",

  "coupleChatMessages",

  "appStreakCount",
  "appStreakBest",
  "appStreakLastDate",

  "bearLevel",
  "bearAge",
  "bearProgress",
  "bearHappiness",
  "bearAccessory",

  "bearAIName",
  "bearAIChatMessages",
  "bearAIPosX",
  "bearAIPosY"

];


const LOVE_MEDIA_BUCKET =
  "love-media";


const PRIVATE_LOCAL_KEYS = [

  "couplePhoto",

  "customBackground",

  "coupleTotalXP",

  "coupleAvailableXP",

  "coupleXPUsersToday",

  "coupleUnlocked1000",

  "couplePhotoSignedPath",

  "couplePhotoSignedAt"

];


const CLOUD_USER_KEY =
  "__loveCloudUserId";


const CLOUD_COUPLE_KEY =
  "__loveCloudCoupleId";


const CLOUD_CONTEXT_TTL =
  60 * 1000;


const CLOUD_LOAD_COOLDOWN =
  3000;


const PHOTO_SIGNED_URL_TTL =
  6 * 60 * 60 * 1000;


let cloudSaveTimer =
  null;


let cloudSaveInProgress =
  false;


let cloudSaveAgain =
  false;


let couplePhotoMigrationRunning =
  false;


let cloudLoadPromise =
  null;


let cloudContextPromise =
  null;


let cachedLoggedUser =
  null;


let cachedLoggedUserAt =
  0;


let cachedCoupleId =
  null;


let cachedCoupleUserId =
  null;


let cachedCoupleAt =
  0;


let cachedCloudContext =
  null;


let cachedCloudContextAt =
  0;


const pendingDeletedKeys =
  new Set();



/* =========================================================
   CACHE CONTEXT
========================================================= */

function invalidateCloudContextCache() {

  cachedLoggedUser =
    null;


  cachedLoggedUserAt =
    0;


  cachedCoupleId =
    null;


  cachedCoupleUserId =
    null;


  cachedCoupleAt =
    0;


  cachedCloudContext =
    null;


  cachedCloudContextAt =
    0;


  cloudContextPromise =
    null;

}



function getLastCloudLoadAt() {

  try {

    return Number(
      sessionStorage.getItem(
        "__loveLastCloudLoadAt"
      )
    ) || 0;

  } catch (error) {

    return 0;

  }

}



function setLastCloudLoadAt() {

  try {

    sessionStorage.setItem(
      "__loveLastCloudLoadAt",
      String(
        Date.now()
      )
    );

  } catch (error) {
  }

}



/* =========================================================
   UTILIZATOR CONECTAT
========================================================= */

async function getLoggedUser(
  force = false
) {

  if (
    typeof supabaseClient ===
    "undefined"
  ) {

    return null;

  }


  const now =
    Date.now();


  if (
    !force &&
    cachedLoggedUser &&
    (
      now -
      cachedLoggedUserAt
    ) <
    CLOUD_CONTEXT_TTL
  ) {

    return cachedLoggedUser;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .auth
        .getSession();


    if (
      error ||
      !data ||
      !data.session
    ) {

      cachedLoggedUser =
        null;


      cachedLoggedUserAt =
        now;


      return null;

    }


    cachedLoggedUser =
      data.session.user;


    cachedLoggedUserAt =
      now;


    return cachedLoggedUser;

  } catch (error) {

    console.error(
      "Eroare utilizator:",
      error
    );


    return null;

  }

}



/* =========================================================
   AFLĂ CUPLUL
========================================================= */

async function getMyCoupleId(
  force = false
) {

  const user =
    await getLoggedUser(
      force
    );


  if (
    !user
  ) {

    return null;

  }


  const now =
    Date.now();


  if (
    !force &&
    cachedCoupleUserId ===
      user.id &&
    (
      now -
      cachedCoupleAt
    ) <
    CLOUD_CONTEXT_TTL
  ) {

    return cachedCoupleId;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "my_couple_id"
        );


    if (
      error
    ) {

      console.error(
        "Eroare identificare cuplu:",
        error
      );


      return null;

    }


    cachedCoupleId =
      data ||
      null;


    cachedCoupleUserId =
      user.id;


    cachedCoupleAt =
      now;


    return cachedCoupleId;

  } catch (error) {

    console.error(
      "Eroare cuplu:",
      error
    );


    return null;

  }

}



/* =========================================================
   CONTEXT CLOUD
========================================================= */

async function getCloudContext(
  force = false
) {

  const now =
    Date.now();


  if (
    !force &&
    cachedCloudContext &&
    (
      now -
      cachedCloudContextAt
    ) <
    CLOUD_CONTEXT_TTL
  ) {

    return cachedCloudContext;

  }


  if (
    !force &&
    cloudContextPromise
  ) {

    return cloudContextPromise;

  }


  cloudContextPromise =
    (
      async function () {

        const user =
          await getLoggedUser(
            force
          );


        if (
          !user
        ) {

          return null;

        }


        const coupleId =
          await getMyCoupleId(
            force
          );


        const context = {

          user:
            user,

          coupleId:
            coupleId,

          mode:
            coupleId
              ? "couple"
              : "user"

        };


        cachedCloudContext =
          context;


        cachedCloudContextAt =
          Date.now();


        return context;

      }
    )();


  try {

    return await cloudContextPromise;

  } finally {

    cloudContextPromise =
      null;

  }

}



/* =========================================================
   DATE LOCALE
========================================================= */

function getLocalCloudData() {

  const result = {};


  for (
    const key
    of CLOUD_KEYS
  ) {

    const value =
      localStorage.getItem(
        key
      );


    if (
      value !== null
    ) {

      result[key] =
        value;

    }

  }


  return result;

}



function clearCloudLocalData() {

  for (
    const key
    of CLOUD_KEYS
  ) {

    localStorage.removeItem(
      key
    );

  }

}



/* =========================================================
   PROTECȚIE SCHIMBARE CONT
========================================================= */

function protectAgainstAccountMixing(
  userId
) {

  const previousUser =
    localStorage.getItem(
      CLOUD_USER_KEY
    );


  if (
    previousUser &&
    previousUser !==
      userId
  ) {

    clearCloudLocalData();


    for (
      const key
      of PRIVATE_LOCAL_KEYS
    ) {

      localStorage.removeItem(
        key
      );

    }


    localStorage.removeItem(
      CLOUD_COUPLE_KEY
    );

  }

}



/* =========================================================
   APLICĂ DATE CLOUD
========================================================= */

function applyCloudData(
  cloudData,
  clearBefore = false
) {

  if (
    clearBefore
  ) {

    clearCloudLocalData();

  }


  if (
    !cloudData ||
    typeof cloudData !==
      "object"
  ) {

    return;

  }


  for (
    const key
    of CLOUD_KEYS
  ) {

    if (
      !Object.prototype
        .hasOwnProperty
        .call(
          cloudData,
          key
        )
    ) {

      continue;

    }


    const value =
      cloudData[key];


    if (
      value === null ||
      value === undefined
    ) {

      localStorage.removeItem(
        key
      );

    } else {

      localStorage.setItem(
        key,
        String(
          value
        )
      );

    }

  }

}



/* =========================================================
   DATA URL -> BLOB
========================================================= */

function dataURLToBlob(
  dataURL
) {

  try {

    const parts =
      String(
        dataURL
      )
        .split(
          ","
        );


    if (
      parts.length <
      2
    ) {

      return null;

    }


    const mimeMatch =
      parts[0]
        .match(
          /data:([^;]+)/
        );


    const mime =
      mimeMatch
        ? mimeMatch[1]
        : "image/jpeg";


    const binary =
      atob(
        parts[1]
      );


    const bytes =
      new Uint8Array(
        binary.length
      );


    for (
      let i = 0;
      i < binary.length;
      i++
    ) {

      bytes[i] =
        binary.charCodeAt(
          i
        );

    }


    return new Blob(
      [
        bytes
      ],
      {
        type:
          mime
      }
    );

  } catch (error) {

    console.error(
      "Eroare conversie imagine:",
      error
    );


    return null;

  }

}



/* =========================================================
   URL SEMNAT POZĂ

   ÎL PĂSTRĂM 6 ORE
========================================================= */

async function createLoveMediaSignedUrl(
  path,
  force = false
) {

  if (
    !path ||
    typeof supabaseClient ===
      "undefined"
  ) {

    return null;

  }


  if (
    !force
  ) {

    const cachedPath =
      localStorage.getItem(
        "couplePhotoSignedPath"
      );


    const cachedAt =
      Number(
        localStorage.getItem(
          "couplePhotoSignedAt"
        )
      ) || 0;


    const cachedUrl =
      localStorage.getItem(
        "couplePhoto"
      );


    if (
      cachedPath ===
        path &&
      cachedUrl &&
      (
        Date.now() -
        cachedAt
      ) <
      PHOTO_SIGNED_URL_TTL
    ) {

      return cachedUrl;

    }

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .storage
        .from(
          LOVE_MEDIA_BUCKET
        )
        .createSignedUrl(
          path,
          60 * 60 * 24 * 7
        );


    if (
      error ||
      !data ||
      !data.signedUrl
    ) {

      if (
        error
      ) {

        console.error(
          "Eroare URL poză:",
          error
        );

      }


      return null;

    }


    localStorage.setItem(
      "couplePhoto",
      data.signedUrl
    );


    localStorage.setItem(
      "couplePhotoSignedPath",
      path
    );


    localStorage.setItem(
      "couplePhotoSignedAt",
      String(
        Date.now()
      )
    );


    return data.signedUrl;

  } catch (error) {

    console.error(
      "Eroare URL Storage:",
      error
    );


    return null;

  }

}



/* =========================================================
   REFRESH POZĂ
========================================================= */

async function refreshCouplePhotoFromStorage(
  force = false
) {

  const path =
    localStorage.getItem(
      "couplePhotoPath"
    );


  if (
    !path
  ) {

    return null;

  }


  return await createLoveMediaSignedUrl(
    path,
    force
  );

}



/* =========================================================
   ȘTERGE POZĂ STORAGE
========================================================= */

async function deleteLoveMediaFile(
  path
) {

  if (
    !path
  ) {

    return true;

  }


  try {

    const {
      error
    } =
      await supabaseClient
        .storage
        .from(
          LOVE_MEDIA_BUCKET
        )
        .remove(
          [
            path
          ]
        );


    if (
      error
    ) {

      console.warn(
        "Nu s-a putut șterge poza veche:",
        error
      );


      return false;

    }


    return true;

  } catch (error) {

    console.warn(
      "Eroare ștergere Storage:",
      error
    );


    return false;

  }

}



/* =========================================================
   UPLOAD POZĂ CUPLU
========================================================= */

async function uploadCouplePhotoBlob(
  blob,
  options = {}
) {

  const context =
    await getCloudContext();


  if (
    !context ||
    !context.user
  ) {

    return {

      success:
        false,

      error:
        "Nu există utilizator conectat."

    };

  }


  if (
    !blob
  ) {

    return {

      success:
        false,

      error:
        "Imagine invalidă."

    };

  }


  const oldPath =
    localStorage.getItem(
      "couplePhotoPath"
    );


  const mime =
    blob.type ||
    "image/jpeg";


  let extension =
    "jpg";


  if (
    mime.includes(
      "png"
    )
  ) {

    extension =
      "png";

  } else if (
    mime.includes(
      "webp"
    )
  ) {

    extension =
      "webp";

  }


  const random =
    Math.random()
      .toString(
        36
      )
      .slice(
        2,
        9
      );


  const path =
    context.user.id +
    "/couple/couple-photo-" +
    Date.now() +
    "-" +
    random +
    "." +
    extension;


  try {

    const {
      error:
        uploadError
    } =
      await supabaseClient
        .storage
        .from(
          LOVE_MEDIA_BUCKET
        )
        .upload(
          path,
          blob,
          {

            cacheControl:
              "3600",

            upsert:
              false,

            contentType:
              mime

          }
        );


    if (
      uploadError
    ) {

      console.error(
        "Eroare upload poză cuplu:",
        uploadError
      );


      return {

        success:
          false,

        error:
          uploadError.message ||
          "Poza nu s-a putut încărca."

      };

    }


    localStorage.setItem(
      "couplePhotoPath",
      path
    );


    localStorage.removeItem(
      "couplePhotoSignedPath"
    );


    localStorage.removeItem(
      "couplePhotoSignedAt"
    );


    pendingDeletedKeys.delete(
      "couplePhotoPath"
    );


    const saved =
      await forceCloudSave();


    if (
      !saved
    ) {

      await deleteLoveMediaFile(
        path
      );


      if (
        oldPath
      ) {

        localStorage.setItem(
          "couplePhotoPath",
          oldPath
        );

      } else {

        localStorage.removeItem(
          "couplePhotoPath"
        );

      }


      return {

        success:
          false,

        error:
          "Poza a fost încărcată, dar calea nu s-a putut salva."

      };

    }


    const signedUrl =
      await refreshCouplePhotoFromStorage(
        true
      );


    if (
      oldPath &&
      oldPath !==
        path
    ) {

      deleteLoveMediaFile(
        oldPath
      )
        .catch(
          function () {}
        );

    }


    if (
      options.logActivity !== false &&
      typeof window.addCoupleActivity ===
        "function"
    ) {

      window
        .addCoupleActivity(
          "couple_photo_changed",
          {
            text:
              "Poza cuplului a fost schimbată."
          }
        )
        .catch(
          function () {}
        );

    }


    return {

      success:
        true,

      path:
        path,

      url:
        signedUrl

    };

  } catch (error) {

    console.error(
      "Eroare poză cuplu:",
      error
    );


    return {

      success:
        false,

      error:
        "Poza nu s-a putut salva."

    };

  }

}



/* =========================================================
   VERIFICĂ CREATOR
========================================================= */

async function isCurrentUserCoupleCreator(
  coupleId,
  userId
) {

  if (
    !coupleId ||
    !userId
  ) {

    return false;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          "couples"
        )
        .select(
          "created_by"
        )
        .eq(
          "id",
          coupleId
        )
        .maybeSingle();


    return (

      !error &&

      data &&

      data.created_by ===
        userId

    );

  } catch (error) {

    return false;

  }

}



/* =========================================================
   MIGRARE POZĂ VECHE
========================================================= */

async function migrateOldLocalCouplePhoto() {

  if (
    couplePhotoMigrationRunning
  ) {

    return false;

  }


  const existingPath =
    localStorage.getItem(
      "couplePhotoPath"
    );


  if (
    existingPath
  ) {

    await refreshCouplePhotoFromStorage();

    return true;

  }


  const localPhoto =
    localStorage.getItem(
      "couplePhoto"
    );


  if (
    !localPhoto ||
    !localPhoto.startsWith(
      "data:image/"
    )
  ) {

    return false;

  }


  const context =
    await getCloudContext();


  if (
    !context
  ) {

    return false;

  }


  if (
    context.coupleId
  ) {

    const isCreator =
      await isCurrentUserCoupleCreator(
        context.coupleId,
        context.user.id
      );


    if (
      !isCreator
    ) {

      return false;

    }

  }


  const blob =
    dataURLToBlob(
      localPhoto
    );


  if (
    !blob
  ) {

    return false;

  }


  couplePhotoMigrationRunning =
    true;


  try {

    const result =
      await uploadCouplePhotoBlob(
        blob,
        {
          logActivity:
            false
        }
      );


    if (
      result &&
      result.success
    ) {

      console.log(
        "❤️ Poza veche a cuplului a fost mutată în Storage."
      );


      return true;

    }


    return false;

  } finally {

    couplePhotoMigrationRunning =
      false;

  }

}



/* =========================================================
   SINCRONIZEAZĂ POZA
========================================================= */

async function syncCouplePhotoAfterCloud() {

  const path =
    localStorage.getItem(
      "couplePhotoPath"
    );


  if (
    path
  ) {

    await refreshCouplePhotoFromStorage();

    return;

  }


  await migrateOldLocalCouplePhoto();

}



/* =========================================================
   ÎNCARCĂ CLOUD
========================================================= */

async function performCloudLoad() {

  const context =
    await getCloudContext();


  if (
    !context
  ) {

    return false;

  }


  const user =
    context.user;


  const coupleId =
    context.coupleId;


  protectAgainstAccountMixing(
    user.id
  );


  const previousCoupleId =
    localStorage.getItem(
      CLOUD_COUPLE_KEY
    ) ||
    "";


  const newCoupleId =
    coupleId ||
    "";


  const coupleChanged =
    previousCoupleId !==
    newCoupleId;


  try {

    /*
      MOD CUPLU
    */

    if (
      coupleId
    ) {

      const {
        data,
        error
      } =
        await supabaseClient
          .from(
            "couple_app_data"
          )
          .select(
            "data"
          )
          .eq(
            "couple_id",
            coupleId
          )
          .maybeSingle();


      if (
        error
      ) {

        console.error(
          "Eroare citire date cuplu:",
          error
        );


        return false;

      }


      applyCloudData(
        data &&
        data.data
          ? data.data
          : {},
        coupleChanged
      );


      localStorage.setItem(
        CLOUD_USER_KEY,
        user.id
      );


      localStorage.setItem(
        CLOUD_COUPLE_KEY,
        coupleId
      );


      /*
        POZA SE SINCRONIZEAZĂ ÎN FUNDAL.
        Nu mai ține Home blocat.
      */

      syncCouplePhotoAfterCloud()
        .catch(
          function (
            error
          ) {

            console.warn(
              "Sincronizare poză în fundal:",
              error
            );

          }
        );


      return true;

    }


    /*
      MOD CONT PERSONAL
    */

    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          "user_app_data"
        )
        .select(
          "data"
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();


    if (
      error
    ) {

      console.error(
        "Eroare citire cloud:",
        error
      );


      return false;

    }


    if (
      coupleChanged &&
      previousCoupleId
    ) {

      clearCloudLocalData();

    }


    if (
      !data ||
      !data.data
    ) {

      localStorage.setItem(
        CLOUD_USER_KEY,
        user.id
      );


      localStorage.setItem(
        CLOUD_COUPLE_KEY,
        ""
      );


      await saveAppDataToCloud();


      syncCouplePhotoAfterCloud()
        .catch(
          function () {}
        );


      return true;

    }


    applyCloudData(
      data.data,
      false
    );


    localStorage.setItem(
      CLOUD_USER_KEY,
      user.id
    );


    localStorage.setItem(
      CLOUD_COUPLE_KEY,
      ""
    );


    syncCouplePhotoAfterCloud()
      .catch(
        function () {}
      );


    return true;

  } catch (error) {

    console.error(
      "Eroare sincronizare:",
      error
    );


    return false;

  }

}



/* =========================================================
   LOAD CLOUD CU PROTECȚIE LA REQUEST-URI DUPLICATE
========================================================= */

async function loadAppDataFromCloud(
  force = false
) {

  const now =
    Date.now();


  if (
    !force &&
    (
      now -
      getLastCloudLoadAt()
    ) <
    CLOUD_LOAD_COOLDOWN
  ) {

    return true;

  }


  if (
    cloudLoadPromise
  ) {

    return cloudLoadPromise;

  }


  cloudLoadPromise =
    performCloudLoad();


  try {

    const result =
      await cloudLoadPromise;


    if (
      result
    ) {

      setLastCloudLoadAt();

    }


    return result;

  } finally {

    cloudLoadPromise =
      null;

  }

}



/* =========================================================
   SALVEAZĂ CLOUD
========================================================= */

async function saveAppDataToCloud() {

  if (
    cloudSaveInProgress
  ) {

    cloudSaveAgain =
      true;


    return true;

  }


  cloudSaveInProgress =
    true;


  try {

    const context =
      await getCloudContext();


    if (
      !context
    ) {

      return false;

    }


    const user =
      context.user;


    const coupleId =
      context.coupleId;


    const localData =
      getLocalCloudData();


    const table =
      coupleId
        ? "couple_app_data"
        : "user_app_data";


    const keyColumn =
      coupleId
        ? "couple_id"
        : "user_id";


    const keyValue =
      coupleId ||
      user.id;


    const {
      data:
        oldRow,

      error:
        readError
    } =
      await supabaseClient
        .from(
          table
        )
        .select(
          "data"
        )
        .eq(
          keyColumn,
          keyValue
        )
        .maybeSingle();


    if (
      readError
    ) {

      console.error(
        "Eroare citire înainte de salvare:",
        readError
      );


      return false;

    }


    const mergedData = {

      ...(
        oldRow &&
        oldRow.data
          ? oldRow.data
          : {}
      ),

      ...localData

    };


    for (
      const key
      of pendingDeletedKeys
    ) {

      delete mergedData[key];

    }


    const payload =
      coupleId

        ? {

            couple_id:
              coupleId,

            data:
              mergedData,

            updated_at:
              new Date()
                .toISOString()

          }

        : {

            user_id:
              user.id,

            data:
              mergedData,

            updated_at:
              new Date()
                .toISOString()

          };


    const {
      error
    } =
      await supabaseClient
        .from(
          table
        )
        .upsert(
          payload,
          {
            onConflict:
              keyColumn
          }
        );


    if (
      error
    ) {

      console.error(
        "Eroare salvare cloud:",
        error
      );


      return false;

    }


    pendingDeletedKeys.clear();


    localStorage.setItem(
      CLOUD_USER_KEY,
      user.id
    );


    localStorage.setItem(
      CLOUD_COUPLE_KEY,
      coupleId ||
      ""
    );


    return true;

  } catch (error) {

    console.error(
      "Eroare salvare:",
      error
    );


    return false;

  } finally {

    cloudSaveInProgress =
      false;


    if (
      cloudSaveAgain
    ) {

      cloudSaveAgain =
        false;


      setTimeout(
        function () {

          saveAppDataToCloud();

        },
        50
      );

    }

  }

}



/* =========================================================
   SALVARE AUTOMATĂ
========================================================= */

function queueCloudSave() {

  clearTimeout(
    cloudSaveTimer
  );


  cloudSaveTimer =
    setTimeout(
      function () {

        saveAppDataToCloud();

      },
      850
    );

}



/* =========================================================
   SALVEAZĂ SETARE
========================================================= */

function saveSetting(
  key,
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    localStorage.removeItem(
      key
    );


    pendingDeletedKeys.add(
      key
    );

  } else {

    localStorage.setItem(
      key,
      String(
        value
      )
    );


    pendingDeletedKeys.delete(
      key
    );

  }


  queueCloudSave();

}



/* =========================================================
   SALVEAZĂ JSON
========================================================= */

function saveJSON(
  key,
  value
) {

  localStorage.setItem(
    key,
    JSON.stringify(
      value
    )
  );


  pendingDeletedKeys.delete(
    key
  );


  queueCloudSave();

}



/* =========================================================
   SALVARE IMEDIATĂ
========================================================= */

async function forceCloudSave() {

  clearTimeout(
    cloudSaveTimer
  );


  return await saveAppDataToCloud();

}



/* =========================================================
   CREEAZĂ CUPLU
========================================================= */

async function createCoupleInvite() {

  await forceCloudSave();

  await migrateOldLocalCouplePhoto();

  await forceCloudSave();


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "create_couple_invite"
        );


    if (
      error
    ) {

      return {

        success:
          false,

        error:
          error.message ||
          "Nu s-a putut crea invitația."

      };

    }


    const row =
      Array.isArray(
        data
      )
        ? data[0]
        : data;


    if (
      !row
    ) {

      return {

        success:
          false,

        error:
          "Nu am primit codul de invitație."

      };

    }


    invalidateCloudContextCache();


    await loadAppDataFromCloud(
      true
    );


    return {

      success:
        true,

      coupleId:
        row.couple_id,

      inviteCode:
        row.invite_code

    };

  } catch (error) {

    console.error(
      "Eroare creare cuplu:",
      error
    );


    return {

      success:
        false,

      error:
        "Nu s-a putut crea invitația."

    };

  }

}



/* =========================================================
   INTRĂ ÎN CUPLU CU COD
========================================================= */

async function joinCoupleByCode(
  code
) {

  const cleanCode =
    String(
      code ||
      ""
    )
      .trim()
      .toUpperCase();


  if (
    !cleanCode
  ) {

    return {

      success:
        false,

      error:
        "Introdu codul de invitație."

    };

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "join_couple_by_code",
          {
            p_code:
              cleanCode
          }
        );


    if (
      error
    ) {

      return {

        success:
          false,

        error:
          error.message ||
          "Codul nu este valid."

      };

    }


    invalidateCloudContextCache();


    await loadAppDataFromCloud(
      true
    );


    return {

      success:
        true,

      coupleId:
        data

    };

  } catch (error) {

    console.error(
      "Eroare conectare la cuplu:",
      error
    );


    return {

      success:
        false,

      error:
        "Nu s-a putut conecta partenerul."

    };

  }

}



/* =========================================================
   INFO CUPLU
========================================================= */

async function getCoupleInfo() {

  const context =
    await getCloudContext();


  if (
    !context ||
    !context.coupleId
  ) {

    return {

      connected:
        false

    };

  }


  try {

    /*
      Citim în paralel:
      - datele cuplului
      - membrii cuplului
      - emailul partenerului

      Emailul este returnat de o funcție SQL securizată
      care permite acces doar la partenerul din același cuplu.
    */

    const results =
      await Promise.all([

        supabaseClient
          .from(
            "couples"
          )
          .select(
            "id, invite_code, created_by, created_at"
          )
          .eq(
            "id",
            context.coupleId
          )
          .maybeSingle(),

        supabaseClient
          .from(
            "couple_members"
          )
          .select(
            "user_id, joined_at"
          )
          .eq(
            "couple_id",
            context.coupleId
          )
          .order(
            "joined_at",
            {
              ascending:
                true
            }
          ),

        supabaseClient
          .rpc(
            "get_my_partner_email"
          )

      ]);


    const coupleResult =
      results[0];


    const membersResult =
      results[1];


    const partnerEmailResult =
      results[2];


    if (
      coupleResult.error
    ) {

      console.error(
        "Eroare informații cuplu:",
        coupleResult.error
      );

    }


    if (
      membersResult.error
    ) {

      console.error(
        "Eroare membri cuplu:",
        membersResult.error
      );

    }


    if (
      partnerEmailResult.error
    ) {

      console.error(
        "Eroare email partener:",
        partnerEmailResult.error
      );

    }


    const couple =
      coupleResult.data;


    const memberList =
      Array.isArray(
        membersResult.data
      )
        ? membersResult.data
        : [];


    return {

      connected:
        true,

      coupleId:
        context.coupleId,

      inviteCode:
        couple
          ? couple.invite_code
          : "",

      memberCount:
        memberList.length,

      partnerConnected:
        memberList.length >=
        2,

      partnerEmail:
        partnerEmailResult &&
        !partnerEmailResult.error &&
        partnerEmailResult.data
          ? String(
              partnerEmailResult.data
            )
          : "",

      members:
        memberList,

      currentUserId:
        context.user.id,

      createdBy:
        couple
          ? couple.created_by
          : null

    };

  } catch (error) {

    console.error(
      "Eroare getCoupleInfo:",
      error
    );


    return {

      connected:
        false

    };

  }

}



/* =========================================================
   ADAUGĂ ACTIVITATE
========================================================= */

async function addCoupleActivity(
  action,
  details = {}
) {

  const context =
    await getCloudContext();


  if (
    !context ||
    !context.coupleId
  ) {

    return false;

  }


  try {

    const {
      error
    } =
      await supabaseClient
        .from(
          "couple_activity"
        )
        .insert(
          {

            couple_id:
              context.coupleId,

            user_id:
              context.user.id,

            action:
              String(
                action ||
                "activity"
              ),

            details:
              details &&
              typeof details ===
                "object"
                ? details
                : {}

          }
        );


    if (
      error
    ) {

      console.error(
        "Eroare activitate cuplu:",
        error
      );


      return false;

    }


    return true;

  } catch (error) {

    console.error(
      "Eroare activitate:",
      error
    );


    return false;

  }

}



/* =========================================================
   CITEȘTE ACTIVITATE
========================================================= */

async function getCoupleActivity(
  limit = 30
) {

  const context =
    await getCloudContext();


  if (
    !context ||
    !context.coupleId
  ) {

    return [];

  }


  const safeLimit =
    Math.max(
      1,
      Math.min(
        100,
        Number(
          limit
        ) ||
        30
      )
    );


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          "couple_activity"
        )
        .select(
          "id, user_id, action, details, created_at"
        )
        .eq(
          "couple_id",
          context.coupleId
        )
        .order(
          "created_at",
          {
            ascending:
              false
          }
        )
        .limit(
          safeLimit
        );


    if (
      error
    ) {

      console.error(
        "Eroare citire activitate:",
        error
      );


      return [];

    }


    return (
      Array.isArray(
        data
      )
        ? data
        : []
    )
      .map(
        function (
          item
        ) {

          return {

            ...item,

            isMine:
              item.user_id ===
              context.user.id

          };

        }
      );

  } catch (error) {

    console.error(
      "Eroare activitate cuplu:",
      error
    );


    return [];

  }

}



/* =========================================================
   DATĂ LOCALĂ
========================================================= */

function getLocalDateKey(
  date = new Date()
) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() +
      1
    )
      .padStart(
        2,
        "0"
      );


  const day =
    String(
      date.getDate()
    )
      .padStart(
        2,
        "0"
      );


  return (
    year +
    "-" +
    month +
    "-" +
    day
  );

}



function getYesterdayDateKey() {

  const yesterday =
    new Date();


  yesterday.setDate(
    yesterday.getDate() -
    1
  );


  return getLocalDateKey(
    yesterday
  );

}



/* =========================================================
   INFO STREAK
========================================================= */

function getAppStreakInfo() {

  const count =
    Math.max(
      0,
      Number(
        localStorage.getItem(
          "appStreakCount"
        )
      ) ||
      0
    );


  const best =
    Math.max(
      count,
      Number(
        localStorage.getItem(
          "appStreakBest"
        )
      ) ||
      0
    );


  const lastDate =
    localStorage.getItem(
      "appStreakLastDate"
    ) ||
    "";


  let level =
    "orange";


  if (
    count >=
    30
  ) {

    level =
      "blue";

  } else if (
    count >=
    14
  ) {

    level =
      "purple";

  } else if (
    count >=
    7
  ) {

    level =
      "red";

  }


  return {

    count:
      count,

    best:
      best,

    lastDate:
      lastDate,

    level:
      level

  };

}



/* =========================================================
   APLICĂ STREAK LOCAL
========================================================= */

function applyAppStreakLocal(
  count,
  best,
  lastDate
) {

  localStorage.setItem(
    "appStreakCount",
    String(
      count
    )
  );


  localStorage.setItem(
    "appStreakBest",
    String(
      best
    )
  );


  localStorage.setItem(
    "appStreakLastDate",
    String(
      lastDate
    )
  );


  pendingDeletedKeys.delete(
    "appStreakCount"
  );


  pendingDeletedKeys.delete(
    "appStreakBest"
  );


  pendingDeletedKeys.delete(
    "appStreakLastDate"
  );

}



/* =========================================================
   ÎNREGISTREAZĂ ZIUA
========================================================= */

async function registerDailyAppOpen() {

  const context =
    await getCloudContext();


  if (
    !context
  ) {

    return {

      success:
        false,

      ...getAppStreakInfo()

    };

  }


  const today =
    getLocalDateKey();


  const yesterday =
    getYesterdayDateKey();


  try {

    const table =
      context.coupleId
        ? "couple_app_data"
        : "user_app_data";


    const keyColumn =
      context.coupleId
        ? "couple_id"
        : "user_id";


    const keyValue =
      context.coupleId ||
      context.user.id;


    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          table
        )
        .select(
          "data"
        )
        .eq(
          keyColumn,
          keyValue
        )
        .maybeSingle();


    if (
      error
    ) {

      console.error(
        "Eroare citire serie:",
        error
      );


      return {

        success:
          false,

        ...getAppStreakInfo()

      };

    }


    const oldData =
      data &&
      data.data
        ? data.data
        : {};


    let count =
      Math.max(
        0,
        Number(
          oldData.appStreakCount
        ) ||
        0
      );


    let best =
      Math.max(
        count,
        Number(
          oldData.appStreakBest
        ) ||
        0
      );


    const lastDate =
      oldData.appStreakLastDate
        ? String(
            oldData.appStreakLastDate
          )
        : "";


    if (
      lastDate ===
      today
    ) {

      applyAppStreakLocal(
        count,
        best,
        today
      );


      return {

        success:
          true,

        increased:
          false,

        ...getAppStreakInfo()

      };

    }


    if (
      lastDate ===
      yesterday
    ) {

      count +=
        1;

    } else {

      count =
        1;

    }


    best =
      Math.max(
        best,
        count
      );


    const mergedData = {

      ...oldData,

      appStreakCount:
        String(
          count
        ),

      appStreakBest:
        String(
          best
        ),

      appStreakLastDate:
        today

    };


    const payload =
      context.coupleId

        ? {

            couple_id:
              context.coupleId,

            data:
              mergedData,

            updated_at:
              new Date()
                .toISOString()

          }

        : {

            user_id:
              context.user.id,

            data:
              mergedData,

            updated_at:
              new Date()
                .toISOString()

          };


    const {
      error:
        saveError
    } =
      await supabaseClient
        .from(
          table
        )
        .upsert(
          payload,
          {
            onConflict:
              keyColumn
          }
        );


    if (
      saveError
    ) {

      console.error(
        "Eroare salvare serie:",
        saveError
      );


      return {

        success:
          false,

        ...getAppStreakInfo()

      };

    }


    applyAppStreakLocal(
      count,
      best,
      today
    );


    return {

      success:
        true,

      increased:
        true,

      ...getAppStreakInfo()

    };

  } catch (error) {

    console.error(
      "Eroare serie zilnică:",
      error
    );


    return {

      success:
        false,

      ...getAppStreakInfo()

    };

  }

}



/* =========================================================
   CACHE XP
========================================================= */

function cacheCoupleXP(
  data
) {

  if (
    !data ||
    typeof data !==
      "object"
  ) {

    return;

  }


  const totalXP =
    Math.max(
      0,
      Number(
        data.total_xp ??
        data.totalXP
      ) ||
      0
    );


  const availableXP =
    Math.max(
      0,
      Number(
        data.available_xp ??
        data.availableXP
      ) ||
      0
    );


  const usersToday =
    Math.max(
      0,
      Number(
        data.users_today ??
        data.usersToday
      ) ||
      0
    );


  const unlocked1000 =
    Boolean(

      data.unlocked_1000 ??

      data.unlocked1000 ??

      totalXP >=
        1000

    );


  localStorage.setItem(
    "coupleTotalXP",
    String(
      totalXP
    )
  );


  localStorage.setItem(
    "coupleAvailableXP",
    String(
      availableXP
    )
  );


  localStorage.setItem(
    "coupleXPUsersToday",
    String(
      usersToday
    )
  );


  localStorage.setItem(
    "coupleUnlocked1000",
    unlocked1000
      ? "true"
      : "false"
  );

}



/* =========================================================
   XP DIN CACHE
========================================================= */

function getCachedCoupleXP() {

  const totalXP =
    Math.max(
      0,
      Number(
        localStorage.getItem(
          "coupleTotalXP"
        )
      ) ||
      0
    );


  const availableXP =
    Math.max(
      0,
      Number(
        localStorage.getItem(
          "coupleAvailableXP"
        )
      ) ||
      0
    );


  const usersToday =
    Math.max(
      0,
      Number(
        localStorage.getItem(
          "coupleXPUsersToday"
        )
      ) ||
      0
    );


  return {

    totalXP:
      totalXP,

    availableXP:
      availableXP,

    usersToday:
      usersToday,

    unlocked1000:
      (
        localStorage.getItem(
          "coupleUnlocked1000"
        ) ===
        "true"
      )
      ||
      totalXP >=
        1000

  };

}



/* =========================================================
   CITEȘTE XP DIN SUPABASE
========================================================= */

async function getCoupleXP() {

  const context =
    await getCloudContext();


  if (
    !context ||
    !context.user
  ) {

    return {

      success:
        false,

      error:
        "Nu există utilizator conectat.",

      ...getCachedCoupleXP()

    };

  }


  if (
    !context.coupleId
  ) {

    return {

      success:
        false,

      noCouple:
        true,

      error:
        "XP-ul comun devine activ după conectarea partenerului.",

      ...getCachedCoupleXP()

    };

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "get_my_couple_xp"
        );


    if (
      error
    ) {

      console.error(
        "Eroare citire XP:",
        error
      );


      return {

        success:
          false,

        error:
          error.message ||
          "XP-ul nu a putut fi citit.",

        ...getCachedCoupleXP()

      };

    }


    const row =
      Array.isArray(
        data
      )
        ? data[0]
        : data;


    if (
      !row
    ) {

      cacheCoupleXP(
        {

          total_xp:
            0,

          available_xp:
            0,

          users_today:
            0,

          unlocked_1000:
            false

        }
      );

    } else {

      cacheCoupleXP(
        row
      );

    }


    return {

      success:
        true,

      ...getCachedCoupleXP()

    };

  } catch (error) {

    console.error(
      "Eroare getCoupleXP:",
      error
    );


    return {

      success:
        false,

      error:
        "XP-ul nu a putut fi citit.",

      ...getCachedCoupleXP()

    };

  }

}



/* =========================================================
   XP ZILNIC
========================================================= */

async function claimDailyAppXP() {

  const context =
    await getCloudContext();


  if (
    !context ||
    !context.user
  ) {

    return {

      success:
        false,

      awarded:
        false,

      xpAdded:
        0,

      error:
        "Nu există utilizator conectat.",

      ...getCachedCoupleXP()

    };

  }


  if (
    !context.coupleId
  ) {

    return {

      success:
        false,

      awarded:
        false,

      xpAdded:
        0,

      noCouple:
        true,

      error:
        "XP-ul comun devine activ după conectarea partenerului.",

      ...getCachedCoupleXP()

    };

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "claim_daily_app_xp"
        );


    if (
      error
    ) {

      console.error(
        "Eroare acordare XP zilnic:",
        error
      );


      return {

        success:
          false,

        awarded:
          false,

        xpAdded:
          0,

        error:
          error.message ||
          "XP-ul zilnic nu a putut fi acordat.",

        ...getCachedCoupleXP()

      };

    }


    const row =
      Array.isArray(
        data
      )
        ? data[0]
        : data;


    if (
      !row
    ) {

      return {

        success:
          false,

        awarded:
          false,

        xpAdded:
          0,

        error:
          "Supabase nu a returnat datele XP.",

        ...getCachedCoupleXP()

      };

    }


    cacheCoupleXP(
      row
    );


    return {

      success:
        true,

      awarded:
        row.awarded ===
        true,

      xpAdded:
        Math.max(
          0,
          Number(
            row.xp_added
          ) ||
          0
        ),

      ...getCachedCoupleXP()

    };

  } catch (error) {

    console.error(
      "Eroare claimDailyAppXP:",
      error
    );


    return {

      success:
        false,

      awarded:
        false,

      xpAdded:
        0,

      error:
        "XP-ul zilnic nu a putut fi acordat.",

      ...getCachedCoupleXP()

    };

  }

}



/* =========================================================
   SCHIMBARE LOGIN / LOGOUT
========================================================= */

if (
  typeof supabaseClient !==
    "undefined" &&
  supabaseClient.auth &&
  typeof supabaseClient
    .auth
    .onAuthStateChange ===
    "function"
) {

  supabaseClient
    .auth
    .onAuthStateChange(
      function () {

        invalidateCloudContextCache();

      }
    );

}



/* =========================================================
   EXPORTURI
========================================================= */

window.getLoggedUser =
  getLoggedUser;


window.getMyCoupleId =
  getMyCoupleId;


window.getCloudContext =
  getCloudContext;


window.loadAppDataFromCloud =
  loadAppDataFromCloud;


window.saveAppDataToCloud =
  saveAppDataToCloud;


window.queueCloudSave =
  queueCloudSave;


window.saveSetting =
  saveSetting;


window.saveJSON =
  saveJSON;


window.forceCloudSave =
  forceCloudSave;


/* POZA */

window.uploadCouplePhotoBlob =
  uploadCouplePhotoBlob;


window.refreshCouplePhotoFromStorage =
  refreshCouplePhotoFromStorage;


window.migrateOldLocalCouplePhoto =
  migrateOldLocalCouplePhoto;


/* CUPLU */

window.createCoupleInvite =
  createCoupleInvite;


window.joinCoupleByCode =
  joinCoupleByCode;


window.getCoupleInfo =
  getCoupleInfo;


/* ACTIVITATE */

window.addCoupleActivity =
  addCoupleActivity;


window.getCoupleActivity =
  getCoupleActivity;


/* STREAK */

window.registerDailyAppOpen =
  registerDailyAppOpen;


window.getAppStreakInfo =
  getAppStreakInfo;


/* XP */

window.claimDailyAppXP =
  claimDailyAppXP;


window.getCoupleXP =
  getCoupleXP;


window.getCachedCoupleXP =
  getCachedCoupleXP;


/* CACHE */

window.invalidateCloudContextCache =
  invalidateCloudContextCache;