var sw = require('swagger-node-express');
var paramTypes = sw.paramTypes;
var url = require("url");
var swe = sw.errors;
var petData = require("./service.js");

// the description will be picked up in the resource listing
exports.findById = {
  'spec': {
    description : "Operations about pets",  
    path : "/pet/{petId}",
    method: "GET",
    summary : "Find pet by ID",
    notes : "Returns a pet based on ID",
    type : "Pet",
    nickname : "getPetById",
    produces : ["application/json"],
    parameters : [paramTypes.path("petId", "ID of pet that needs to be fetched", "string")],
    responseMessages : [swe.invalid('id'), swe.notFound('pet')]
  },
  'action': function (req,res) {
    if (!req.params.petId) {
      throw swe.invalid('id'); }
    var id = parseInt(req.params.petId);
    var pet = petData.getPetById(id);

    if(pet) res.send(JSON.stringify(pet));
    else throw swe.notFound('pet', res);
  }
};

exports.findByStatus = {
  'spec': {
    path : "/pet/findByStatus",
    notes : "Multiple status values can be provided with comma-separated strings",
    summary : "Find pets by status",
    method: "GET",    
    parameters : [
      paramTypes.query("status", "Status in the store", "string", true, ["available","pending","sold"], "available")
    ],
    type : "array",
    items: {
      $ref: "Pet"
    },
    responseMessages : [swe.invalid('status')],
    nickname : "findPetsByStatus"
  },  
  'action': function (req,res) {
    var statusString = url.parse(req.url,true).query["status"];
    if (!statusString) {
      throw swe.invalid('status', res); }

    var output = petData.findPetByStatus(statusString);
    res.send(JSON.stringify(output));
  }
};

exports.findByTags = {
  'spec': {
    path : "/pet/findByTags",
    notes : "Multiple tags can be provided with comma-separated strings. Use tag1, tag2, tag3 for testing.",
    summary : "Find pets by tags",
    method: "GET",    
    parameters : [paramTypes.query("tags", "Tags to filter by", "string", true)],
    type : "array",
    items: {
      $ref: "Pet"
    },
    responseMessages : [swe.invalid('tag')],
    nickname : "findPetsByTags"
  },
  'action': function (req,res) {
    var tagsString = url.parse(req.url,true).query["tags"];
    if (!tagsString) {
      throw swe.invalid('tag', res); }
    var output = petData.findPetByTags(tagsString);
    sw.setHeaders(res);
    res.send(JSON.stringify(output));
  }
};

exports.addPet = {
  'spec': {
    path : "/pet",
    notes : "adds a pet to the store",
    summary : "Add a new pet to the store",
    method: "POST",
    parameters : [paramTypes.body("body", "Pet object that needs to be added to the store", "Pet")],
    responseMessages : [swe.invalid('input')],
    nickname : "addPet"
  },  
  'action': function(req, res) {
    var body = req.body;

    if(typeof body === 'undefined' || typeof body.id === 'undefined'){
      throw swe.invalid('pet', res);
    }
    else{
	    petData.addPet(body);
	    res.send(JSON.stringify(body));
	  }  
  }
};

exports.updatePet = {
  'spec': {
    path : "/pet",
    notes : "updates a pet in the store",
    method: "PUT",    
    summary : "Update an existing pet",
    parameters : [paramTypes.body("body", "Pet object that needs to be updated in the store", "Pet")],
    responseMessages : [swe.invalid('id'), swe.notFound('pet'), swe.invalid('input')],
    nickname : "addPet"
  },  
  'action': function(req, res) {
    var body = req.body;
    if(typeof body === 'undefined' || typeof body.id === 'undefined'){
      throw swe.invalid('pet', res);
    }
    else {
	    petData.addPet(body);
	    res.send({'success': true});
	  }
  }
};

exports.deletePet = {
  'spec': {
    path : "/pet/{id}",
    notes : "removes a pet from the store",
    method: "DELETE",
    summary : "Remove an existing pet",
    parameters : [paramTypes.path("id", "ID of pet that needs to be removed", "string")],
    responseMessages : [swe.invalid('id'), swe.notFound('pet')],
    nickname : "deletePet" 
  },  
  'action': function(req, res) {
    var id = parseInt(req.params.id);
    petData.deletePet(id)
    res.send(204);
  }
};