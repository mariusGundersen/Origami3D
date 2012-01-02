Origami.world = {
	
	shapes:[
		/*{
			type:"polygon",
			verts:[
				{x:1000, y:1000, z: 1000},
				{x:-1000, y:1000, z: 1000},
				{x:-1000, y:-1000, z: 1000},
				{x:1000, y:-1000, z: 1000},
				{x:1000, y:1000, z: -1000},
				{x:-1000, y:1000, z: -1000},
				{x:-1000, y:-1000, z: -1000},
				{x:1000, y:-1000, z: -1000},
			],
			polygons:[
				{v2: 1, v1: 0, v3: 3, texture:"north1"},
				{v2: 3, v1: 2, v3: 1, texture:"north2"},
			
				{v2: 4, v1: 5, v3: 6, texture:"south1"},
				{v2: 7, v1: 4, v3: 6, texture:"south2"},
			
				{v2: 5, v1: 1, v3: 2, texture:"east1"},
				{v2: 6, v1: 5, v3: 2, texture:"east2"},
			
				{v2: 0, v1: 4, v3: 7, texture:"west1"},
				{v2: 3, v1: 0, v3: 7, texture:"west2"},
			
				{v2: 2, v1: 3, v3: 7, texture:"down1"},
				{v2: 6, v1: 2, v3: 7, texture:"down2"},
			
				{v2: 1, v1: 5, v3: 0, texture:"up2"},
				{v2: 5, v1: 4, v3: 0, texture:"up1"},
				
				
			]
		}*/
	],
	textures:{
		"color":{
			color: "#0DD"
		},
		/*"north1":{
			image:"north",
			p1:{x:0, y:0},
			p2:{x:512, y:0},
			p3:{x:0, y:512}
		},
		"north2":{
			image:"north",
			p3:{x:512, y:0},
			p2:{x:0, y:512},
			p1:{x:512, y:512}
		},
		"south1":{
			image:"south",
			p1:{x:0, y:0},
			p2:{x:512, y:0},
			p3:{x:0, y:512}
		},
		"south2":{
			image:"south",
			p1:{x:512, y:0},
			p3:{x:0, y:512},
			p2:{x:512, y:512}
		},
		"east1":{
			image:"east",
			p1:{x:0, y:0},
			p2:{x:512, y:0},
			p3:{x:0, y:512}
		},
		"east2":{
			image:"east",
			p1:{x:512, y:0},
			p3:{x:0, y:512},
			p2:{x:512, y:512}
		},
		"west1":{
			image:"west",
			p1:{x:0, y:0},
			p2:{x:512, y:0},
			p3:{x:0, y:512}
		},
		"west2":{
			image:"west",
			p1:{x:512, y:0},
			p3:{x:0, y:512},
			p2:{x:512, y:512}
		},
		"down1":{
			image:"down",
			p1:{x:0, y:0},
			p2:{x:512, y:0},
			p3:{x:0, y:512}
		},
		"down2":{
			image:"down",
			p1:{x:512, y:0},
			p3:{x:0, y:512},
			p2:{x:512, y:512}
		},
		"up1":{
			image:"up",
			p1:{x:0, y:0},
			p2:{x:512, y:0},
			p3:{x:0, y:512}
		},
		"up2":{
			image:"up",
			p1:{x:512, y:0},
			p3:{x:0, y:512},
			p2:{x:512, y:512}
		},*/
		
		
		
	},
	images: {
		"north":{
			url:"gfx/skybox_n.jpg"
		},
		"south":{
			url:"gfx/skybox_s.jpg"
		},
		"east":{
			url:"gfx/skybox_e.jpg"
		},
		"west":{
			url:"gfx/skybox_w.jpg"
		},
		"up":{
			url:"gfx/skybox_t.jpg"
		},
		"down":{
			url:"gfx/skybox_b.jpg"
		}
	}
};
Origami.cam = {
	x:0, 
	y:0, 
	z:0, 
	rx:0, 
	ry:0, 
	rz:0, 
	depth:350
};
