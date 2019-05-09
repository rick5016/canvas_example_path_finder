class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.walkable = this.isWalkableAt();
    }

    isWalkableAt() {
        for (var key in walls) {
            var wall = walls[key];
            if (this.y >= wall.y1 && this.y <= (wall.y1 + wall.y2)) {
                if (this.x >= wall.x1 && this.x <= (wall.x1 + wall.x2)) {
                    return false
                }
            }
        }

        return true
    }

}