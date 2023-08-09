window.onload = () => {

    //contextmenu禁用右键菜单
    document.oncontextmenu = e => {
        e.preventDefault();
        return false;
    };

    //兼容mac电脑
    document.addEventListener("contextmenu", e => {
        e.preventDefault();
        return false;
    });

    //解决globalThis为undefined的问题
    this.globalThis || (this.globalThis = this);

};