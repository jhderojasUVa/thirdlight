thirdLight.factory('factoryservice', function($http) {
  // This is a factory, but you can create a service too
  // Because a service or a provider or a factory it's a factory I always preffeer to create a factory
  // Maybe because it have an object way to work... who knows :)
  // Well maybe it's because the breadcrumb that must be only one and consistant all the time
  return {
    // Because it have a breadcrumb, we must create the "Home" element with no id and no parentId (it's home!)
    breadcrumb: [{
      order: 1,
      item: {
        name: 'Home',
        id: null,
        parentId: null
      }
    }],
    // Methods of the breadcrumb
    addToBreadcrumb: function(item) {
      // Add item to breadcrumb
      // item = data of the item

      // Pushing into the array a new "piece"
      this.breadcrumb.push({
        order: (this.breadcrumb.length+1),
        item: item,
      });
    },
    delToBreadcrumb: function(index) {
      // Delete item from breadcrumb
      // It will delete from the index/order you select to the finish
      // index = number, order of the element to delete
      var delSize = parseInt(this.breadcrumb.length - index);
      // If it's first it will delete nothing so we must handle
      if (delSize == 0) {
        delSize = 1;
        index = 1;
      }
      // Splite to delete the item(s)
      this.breadcrumb.splice(index, delSize);
    },
    // Methods for getting the content of the data/folders
    getFolders: function() {
      // Get the base (Home) data with all the properties
      return $http.get('/api/top/children')
        .then(function(response) {
          return response.data;
        });
    },
    getFoldersIds: function() {
      // Get the IDs of the (Home) data (only ids)
      return $http.get('/api/top/childids')
        .then(function(response) {
          return response.data;
        });
    },
    getItem: function(itemId) {
      // Get the content of an item with all his properties
      return $http.get('/api/item/'+ itemId)
        .then(function(response) {
          return response.data;
        });
    },
    getItemFolders: function(itemId) {
      // Get the content (properties, data) of the children folder by his id
      return $http.get('/api/item/'+ itemId +'/children')
        .then(function(response) {
          return response.data;
        });
    },
    getItemFoldersIds: function(itemId) {
      // Get the ids of the content of the children folder by his id
      $http.get('/api/item/'+ itemId +'/childrenids')
        .then(function(response) {
          return response.data;
        });
    }
  }
});
