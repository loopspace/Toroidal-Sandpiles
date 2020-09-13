var geometry;

const SOFT = 0;
const HARD = 1;
const TORUS = 2;
const KLEIN = 3;
const PROJECTIVE = 4;

function init() {
    var ript = document.getElementById("rows");
    var rows = localStorage.getItem("rows");
    if (!rows) {
	rows = 4;
    }
    ript.value = rows;

    var cipt = document.getElementById("cols");
    var cols = localStorage.getItem("cols");
    if (!cols) {
	cols = 7;
    }
    cipt.value = cols;

    ript.addEventListener("change", function() { setGrid(ript.value, cipt.value) });
    cipt.addEventListener("change", function() { setGrid(ript.value, cipt.value) });
    
    var gipt = document.getElementById("geom");
    var geom = localStorage.getItem("geometry");
    if (!geom) {
	geom = 2;
    }
    gipt.value = geom;

    setGrid(rows,cols);
    geometry = parseInt(geom,10);

    gipt.addEventListener("change", function(e) {
	geometry = parseInt(e.target.value,10);
	localStorage.setItem("geometry", geometry);
    });

    var tple = document.getElementById("topple");
    tple.addEventListener("click", stepGrid);
    var rset = document.getElementById("reset");
    rset.addEventListener("click", resetGrid);


/*
      Make the question mark toggle the help pane
     */
    var hlnk = document.getElementById('helplink');
    var hdv = document.getElementById('help');
    hlnk.addEventListener('click', function(e) {
        e.preventDefault();
        if (hdv.style.display == 'none' || hdv.style.display == '') {
            hdv.style.display = 'block';
        } else {
            hdv.style.display = 'none';
        }
        return false;
    });
    /*
      Set the help pane height to the window height,
      Should probably update on resize
     */
    var h = window.innerHeight - 20;
    hdv.style.height = h + 'px';

}

window.addEventListener("load", init);

function setGrid(r,c) {
    localStorage.setItem("rows", r);
    localStorage.setItem("cols", c);
    var table = document.getElementById("sandpile");
    table.innerHTML = '';

    var tr, td, cell;
    
    for (var i = 0; i < r; i++) {
	tr = document.createElement('tr');
	for (var j = 0; j < c; j++) {
	    td = document.createElement('td');
	    cell = document.createTextNode('0');
	    td.appendChild(cell);
	    td.setAttribute('contenteditable', true);
	    td.classList.add("pile0");
	    tr.appendChild(td);
	}
	table.appendChild(tr);
    }
}

function resetGrid() {
    var table = document.getElementById("sandpile");

    var rows = table.getElementsByTagName("tr");
    var cols;
    var row;

    for (var r = 0; r < rows.length; r++) {
	cols = rows[r].getElementsByTagName("td");
	for (var c = 0; c < cols.length; c++) {
	    cols[c].innerHTML = '';
	    cols[c].textContent = '0';
	    cols[c].classList.remove(...cols[c].classList);
	    cols[c].classList.add("pile0");
	}
    }
}

function stepGrid() {
    var table = document.getElementById("sandpile");

    var rows = table.getElementsByTagName("tr");
    var cols;

    var grid = [];
    var row;

    for (var r = 0; r < rows.length; r++) {
	cols = rows[r].getElementsByTagName("td");
	row = []
	grid.push(row);
	for (var c = 0; c < cols.length; c++) {
	    row.push(parseInt(cols[c].textContent,10));
	}
    }

    /*
      Initialise new grid of zeros
     */
    var ngrid = [];
    for (var r = 0; r < grid.length; r++) {
	ngrid.push([]);
	for (var c = 0; c < grid[r].length; c++) {
	    ngrid[r].push(0);
	}
    }

    for (var r = 0; r < grid.length; r++) {
	for (var c = 0; c < grid[r].length; c++) {
	    ngrid[r][c] += grid[r][c];
	    if (grid[r][c] > 3) {
		ngrid[r][c] -= 4;
		incrementNeighbours(r,c,ngrid);
	    }
	}
    }

    for (var r = 0; r < rows.length; r++) {
	cols = rows[r].getElementsByTagName("td");
	row = []
	for (var c = 0; c < cols.length; c++) {
	    cols[c].innerHTML = '';
	    cols[c].textContent = ngrid[r][c];
	    cols[c].classList.remove(...cols[c].classList);
	    if (ngrid[r][c] > 7) {
		cols[c].classList.add("pile8");
	    } else {
		cols[c].classList.add("pile" + ngrid[r][c]);
	    }
	}
    }
    
}

var nbrs = [ [1,0], [0,1], [-1,0], [0,-1] ];

function incrementNeighbours(r,c,g) {
    var nr, nc;
    for (var i = 0; i < nbrs.length; i++) {
	nr = r + nbrs[i][0];
	nc = c + nbrs[i][1];

	if (nr == -1) {
	    if (geometry == SOFT) {
		return;
	    }
	    if (geometry == HARD) {
		nr = 0;
	    } else {
		nr = g.length - 1;
		if (geometry == KLEIN || geometry == PROJECTIVE) {
		    nc = g[0].length - 1 - nc;
		}
	    }
	} else if (nr == g.length) {
	    if (geometry == SOFT) {
		return;
	    }
	    if (geometry == HARD) {
		nr = g.length - 1;
	    } else {
		nr = 0;
		if (geometry == KLEIN || geometry == PROJECTIVE) {
		    nc = g[0].length - 1 - nc;
		}
	    }
	}
	if (nc == -1) {
	    if (geometry == SOFT) {
		return;
	    }
	    if (geometry == HARD) {
		nc = 0;
	    } else {
		nc = g[0].length - 1;
		if (geometry == PROJECTIVE) {
		    nr = g.length - 1 - nr;
		}
	    }
	} else if (nc == g[0].length) {
	    if (geometry == SOFT) {
		return;
	    }
	    if (geometry == HARD) {
		nc = 0;
	    } else {
		nc = 0;
		if (geometry == PROJECTIVE) {
		    nr = g.length - 1 - nr;
		}
	    }
	}
	g[nr][nc]++;
    }
}
