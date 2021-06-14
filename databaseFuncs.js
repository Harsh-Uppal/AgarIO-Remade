class DatabaseFuncs {

    static setInOthers() {
        others[myID] = [
            playerName,
            [
                layer.position.x,
                layer.position.y
            ],
            layer.diameter,
            false
        ]
    }

    static async updateOtherPlayers() {
        await database.ref("players").on("value", function (data) {
            others = data.val();
        });
    }

    static async updateMyPlayer() {
        await database.ref("/").update({
            players: others
        });
    }

    static async loadEatables() {
        database.ref('eatables').on('value', (data) => {
            eatables = data.val();
        });
    }

    static async loadMinEatablesInRad(){
        database.ref('minEatablesInRad').on('value', (data)=>{
            minEatablesInRad = data.val();
        })
    }

    static updateEatables(){
        database.ref('/').update({
            eatables : eatables
        });
    }

    static setSpawnBorder() {
        database.ref('spawnBorder').on('value', (data) => {
            spawnBorder = data.val();
        });
    }

    static removeEatable(ind) {
        eatables.splice(ind, 1);
        database.ref('/').update({ eatables: eatables });
    }

    static removeMyPlayer() {
        others[myID][3] = true;
        this.updateMyPlayer();
    }

}