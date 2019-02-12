thirdLight.controller('showcontent', function($scope, $http, factoryservice) {
  // We relay all the logic in only one controller because it's more "easy" to understand
  // The controller must relay in three things
  // $scope = to comunicate with the view
  // $http = because the factory uses http extension
  // factoryservice = the factory object

  // We pass the breadcrumb from the factory
  $scope.breadcrumb = factoryservice.breadcrumb;
  // And an extra variable that tells if you are showing a file or a folder
  // to show the content or not of the file
  $scope.fileShow = false;

  // First start... get the "Home" directory
  factoryservice.getFolders().then(function(data) {
    $scope.files = data.data;
  });

  $scope.goToBreadcrumb = function(order, id, parentId, back) {
    // Method when you click on the breadcrumb
    // order = order of the element
    // id = id of the element
    // parentid = parentId of the element
    // back = it's the back button outside the breadcrumb (on the folders?) true/false

    // Delete what we don't need of the breadcrumb
    factoryservice.delToBreadcrumb(order);
    // And call the method getContent who retrieve the content and "work" with the breadcrumb
    $scope.getContent(id, parentId, 'FOLDER', back);
  }

  $scope.getContent = function(id, parentId, type, back) {
    // Method to show the content when you click on an element
    // id = id of the element
    // parentid = parentid of the element
    // type = type of what you click (folder or not)
    // back = it's the back button on the folders?

    // First we must do different actions if the user clicks on a folder or on a file
    switch (type) {
      case 'FOLDER':
        // It's a folder!
        // So it's not a file :)
        $scope.fileShow = false;

        if (id == parentId && parentId == null) {
          // This can sound extrange but, if you go inside and then back to the home
          // id will be parent id or parentId will be null (because how I generate the back)
          factoryservice.getFolders().then(function(data) {
            // Getting all the stuff from the factory (the content)
            $scope.files = data.data;
          });
        } else {
          // You are goind inside, your are not in the Home

          factoryservice.getItemFolders(id).then(function(data) {
            // First, we get the content of the folder
            if (id == parentId) {
              parentId = null; // a trick when you go back
            }

            // If you are not going back
            if (back != true) {
              // We must add to the breadcrumb the new level
              factoryservice.getItem(id).then(function(data) {
                // So we take the name of the folder
                // and add it to the breadcrumb
                // with his needed data (name, id, parentId)
                factoryservice.addToBreadcrumb({
                  name: data.data.name,
                  id: id,
                  parentId: parentId
                });
              });
            }

            // Now we must create the "dots" for going back
            var returnDirectory = [
              {
                order: factoryservice.breadcrumb.length,
                name: '..', // Previous directory
                type: '',
                id: parentId,
                parentId: parentId,
                type: 'FOLDER',
                back: true
              }
            ];

            // And, last, we concatenate the data into the return directory
            // for showing it
            $scope.files = returnDirectory.concat(data.data);
            });
        }
        break;
      case 'FILE':
        // If it's a file, it's very different
        // First we say that you are viewing a file
        $scope.fileShow = true;
        // Now we need the data
        factoryservice.getItem(id).then(function(data) {
          // And put the data to the view
          $scope.filename = data.data;
        });
        break;
    }
  };
});

// This can be done in very different ways, examples:

// Case 1:
// You can create two controllers, breadcrumb-folders and other for the file.
// On this case you can control better, will be more easy to go to the controller that do something concrete.

// Case 2:
// Maybe it will be usefull to put the data of the file on the factory.
// With this way you can do some fancy things like moving files/coping...

// Case 3:
// Three controllers. One for the breadcrumb, other for the folders and the last for the file.
// Thanks that you can relay the data on the factory it will be easy for them to have only one data storage.

// Case 4:
// Use LocalStorage or SessionStorage or WebSQL. You will use a provider and store what you need on the LocalStorage or friends.
// A cons will be that you will require a "moderm web browser".

// Other ways:
// Of course it will be tons of other ways to do this depending on what you need.
// For example I add a way to show the data of a file, but on the API/JSON when you ask about the content of an id
// there's not too much information, so I create some "dumb" text for that.
// Why I haven't put way to order files? Well, because it's a filter I think it will be easy to find what you need
// but.. well.. maybe a way to order on the view will be a great point.
// I have only ordered by name of the item, but remember, because it order by string, the order is
// numbers, uppercase, lowercase... I don't know if it's a good way to order or not... but...
// if needed you can add a sort method that can change with one variable to generate normal or reverse order.
