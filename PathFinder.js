class PathFinder {
    constructor(precision) {
        this.precision = precision;
        this.width = 800;
        this.height = 600;
        this.cmp = function (nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }
        this.map = [];
        this.nodes = [];
    }

    findPath(startX, startY, endX, endY) {

        var startNode = this.setNodeMap(startY, startX),
            endNode = this.setNodeMap(endY, endX),
            weight = 0.1,
            abs = Math.abs, SQRT2 = Math.SQRT2,
            node, neighbors, neighbor, i, l, ng;

        startNode.g = 0;
        startNode.f = 0;

        this.heappush(startNode);
        startNode.opened = true;

        var occur = 0;
        while (!this.empty() && occur < 275000) {
            occur++
            node = this.heappop();
            node.closed = true;
            drawCoordinates(node.x, node.y, 'blue');

            if (node === endNode) {
                var path = [[endNode.x, endNode.y]];
                while (endNode.parent) {
                    endNode = endNode.parent;
                    path.push([endNode.x, endNode.y]);
                }
                return path.reverse();
            }

            neighbors = this.getNeighbors(node);
            for (i = 0, l = neighbors.length; i < l; ++i) {
                neighbor = neighbors[i];

                if (neighbor.closed) {
                    continue;
                }

                ng = node.g + ((neighbor.x - node.x === 0 || neighbor.y - node.y === 0) ? 1 : SQRT2);

                if (!neighbor.opened || ng < neighbor.g) {
                    neighbor.g = ng;
                    neighbor.h = neighbor.h || weight * (abs(neighbor.x - endX) + abs(neighbor.y - endY));
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = node;

                    if (!neighbor.opened) {
                        this.heappush(neighbor);
                        neighbor.opened = true;
                    } else {
                        this.updateItem(neighbor);
                    }
                }
            }
        }

        return [];
    }

    heappush(item) {
        this.nodes.push(item);
        return this._siftdown(this.nodes, 0, this.nodes.length - 1, this.cmp);
    };

    heappop() {
        var lastelt, returnitem;
        lastelt = this.nodes.pop();
        if (this.nodes.length) {
            returnitem = this.nodes[0];
            this.nodes[0] = lastelt;
            this._siftup(this.nodes, 0, this.cmp);
        } else {
            returnitem = lastelt;
        }
        return returnitem;
    };

    updateItem(item) {
        var pos;
        pos = this.nodes.indexOf(item);
        if (pos === -1) {
            return;
        }
        this._siftdown(this.nodes, 0, pos, this.cmp);
        return this._siftup(this.nodes, pos, this.cmp);
    };

    empty() {
        return this.nodes.length === 0;
    };

    _siftdown(array, startpos, pos, cmp) {
        var newitem, parent, parentpos;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        newitem = array[pos];
        while (pos > startpos) {
            parentpos = (pos - 1) >> 1;
            parent = array[parentpos];
            if (cmp(newitem, parent) < 0) {
                array[pos] = parent;
                pos = parentpos;
                continue;
            }
            break;
        }
        return array[pos] = newitem;
    };

    _siftup(array, pos, cmp) {
        var childpos, endpos, newitem, rightpos, startpos;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        endpos = array.length;
        startpos = pos;
        newitem = array[pos];
        childpos = 2 * pos + 1;
        while (childpos < endpos) {
            rightpos = childpos + 1;
            if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
                childpos = rightpos;
            }
            array[pos] = array[childpos];
            pos = childpos;
            childpos = 2 * pos + 1;
        }
        array[pos] = newitem;
        return this._siftdown(array, startpos, pos, cmp);
    };

    setNodeMap(y, x) {
        if (x > -1 && x < this.width && y > -1 && y < this.height) {
            if (this.map[y] == null) {
                this.map[y] = [];
            }
            if (this.map[y][x] == null) {
                this.map[y][x] = new Node(x, y);
            }
            return this.map[y][x];
        }

        return 0;
    }

    getNeighbors(node) {
        var x = node.x,
            y = node.y,
            neighbors = [];

        for (var i = y - this.precision; i <= y + this.precision; i += this.precision) {
            for (var j = x - this.precision; j <= x + this.precision; j += this.precision) {
                if (!(i == y && j == x)) {
                    var node = this.setNodeMap(i, j);
                    if (node && this.map[i][j].walkable) {
                        neighbors.push(this.map[i][j]);
                    }
                }
            }
        }

        return neighbors;
    };
}
