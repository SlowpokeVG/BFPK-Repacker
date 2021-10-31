# BFPK-Repacker
Script that creates a new BFPK archive (Castlevania: LoS) without encryption and with optional compression.

Confirmed working on PC version of Castlevania: Lords of Shadow and was used for making an [undub](https://steamcommunity.com/sharedfiles/filedetails/?id=2642221133).
Might work for other Mercury Engine games, but was never tested.

## Usage
* Unpack game archive with a [quickbms script](http://aluigi.altervista.org/papers/bms/others/castlevania.bms);
* Note down byte 0x04 of the original archive: 
  - If it's 0x02 - game will expect files from it to be raw;
  - if it's 0x03 - be sure to pack files from this archive back with "zip" parameter;
* Edit files you want, you can remove the rest;
* Use script like this:
  * If files in the original archive were packed: 
    * ```.\BFPK-Generator.exe <input folder> <name of the new archive> zip```
  * If not - omit 'zip' from the end of the line: 
    * ```.\BFPK-Generator.exe <input folder> <name of the new archive>```


CV:LOS can load archives with higher number as well (Data18 for example), replacing original files from earlier archives, but it always expects new files to be packed if original files were.

Some files don't get replaced by the engine, so you might have to repack the whole archive back.
