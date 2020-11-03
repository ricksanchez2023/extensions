import * as fs from "fs";

import mockedEnv from "mocked-env";
import sizeOf from "image-size";

const environment = {
  LOCATION: "us-central1",
  IMG_BUCKET: "extensions-testing.appspot.com",
  CACHE_CONTROL_HEADER: undefined,
  IMG_SIZES: "200x200",
  RESIZED_IMAGES_PATH: undefined,
  DELETE_ORIGINAL_FILE: "true",
};

let restoreEnv;
restoreEnv = mockedEnv(environment);

import { resize } from "../functions/src/resize-image";

// 100x100
const TEST_IMAGE = `${__dirname}/test-image.png`;

describe("extension", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => restoreEnv());

  test("throw error if the wrong delimiter is used for resize string", async () => {
    const filePath = "/file/path";
    const errorMessage = "height and width are not delimited by a ',' or a 'x'";

    try {
      resize(filePath, filePath, "200200");
    } catch (e) {
      expect(e.message).toContain(errorMessage);
    }

    try {
      resize(filePath, filePath, "200 200");
    } catch (e) {
      expect(e.message).toContain(errorMessage);
    }
  });

  test("resize image correctly", async () => {
    const temporaryPath = `${__dirname}/temp-image.png`;
    const size = "75x75";

    await resize(TEST_IMAGE, temporaryPath, size);

    var dimensions = sizeOf(temporaryPath);

    expect(dimensions.width).toEqual(75);
    expect(dimensions.height).toEqual(75);

    fs.unlink(temporaryPath, (err) => {
      if (err) throw new Error(err.message);
    });
  });
});
