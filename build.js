const packager = require("electron-packager");
const package = require("./package.json");

packager({
    name: package["name"],
    dir: ".",// ソースフォルダのパス
    out: ".",// 出力先フォルダのパス
    platform: "win32",
    arch: "x64",
    version: "1.6.11",// Electronのバージョン
    overwrite: true,// 上書き
    asar: true,// asarパッケージ化
    "app-version": package["version"],
    "app-copyright": "Copyright (C) 2017 "+package["author"]+".",// コピーライト
    
    "version-string": {// Windowsのみのオプション
        CompanyName: "totoraj.net",
        FileDescription: package["name"],
        OriginalFilename: package["name"]+".exe",
        ProductName: package["name"],
        InternalName: package["name"]
    }
}, function (err, appPaths) {// 完了時のコールバック
    if (err) console.log(err);
    console.log("Done: " + appPaths);
});
