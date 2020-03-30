const archiver = require("archiver");
const { createWriteStream } = require("fs");
const numeral = require("numeral");

/* -------------------------------------------------------------------------------------------------
  Unsigned Archive
*/

function buildUnsignedArchive() {
  return new Promise(resolve => {
    const archiveOutput = createWriteStream(`./postgrester-unsigned.zip`);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Listen for all archive data to be written:
    // The 'close' event is fired only when a file descriptor is involved.
    archiveOutput.on("close", () => {
      console.info(`Unsigned Archive size: ${numeral(archive.pointer()).format("0.00 b")}.`);
      resolve();
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    archiveOutput.on("end", () => console.warn("Warning: Data has been drained"));

    archive.on("error", err => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
    archive.on("warning", err => {
      if (err.code === "ENOENT") {
        console.warn(`Warning: ${err.message}`);
      } else {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
    });

    archive.pipe(archiveOutput);
    archive.glob("**", { cwd: "./dist" });
    archive.finalize();
  });
}

/* -------------------------------------------------------------------------------------------------
  Run
*/

// eslint-disable-next-line func-names
(async function () {
  await buildUnsignedArchive();
})();
