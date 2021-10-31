# BFPK-Repacker
Script that creates a new BFPK archive (Castlevania: LoS) without encryption and with optional compression.
Confirmed working in PC version of Castlevania: Lords of Shadow and was used for making an undub.
Might work for other Mercury Engine games, but was never tested.

## Usage
* Unpack game archive with a [quickbms script](http://aluigi.altervista.org/papers/bms/others/castlevania.bms);
* Note down byte 0x04 of original archive: 
  - If it's 0x02 - game will expect files from it to be raw;
  - if it's 0x03 - be sure to pack files back with "zip" parameter;
* Edit files you want, you can remove the rest;
* Use script like this
  * If files in the original archive were packed: ```.\BFPK-Generator.exe <input folder> <name of the archive> zip```
  * If not - omit 'zip' from the end of the line: ```.\BFPK-Generator.exe <input folder> <name of the archive>```

* CV:LOS can load archives with higher number as well, replacing original files, but it always expects replacing files to be packed if original was.
