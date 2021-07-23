# Paginate Autocmoplete And Combobox

### Depency
* jQuery 3.*
* jQuery-UI 12.* (jquery-ui > autocomplete)
* BootStrip (for combobx-remote)

### Demo
![alt Demo](https://raw.githubusercontent.com/simagu/autocomplete-remote/master/docs/imgs/demo.gif?token=AKXEDLGFMJ5LVHSOMYQQHBTA7KJK4)


### Model
``` javascript
{
	total: 0, // Total data count
	items: [ // return items
	{
		label: '', // display on selection
		text: '', // display on textbox
		value: '' // return value
		data: { // other data, you can use $(selector).paginatedAutocomplete('data') to get this
			property1: 'AAA',
			property2: 'BBB'
		}
	}
	]	
 }
```

### How to run demo ###
1. clone source from git.
2. run `num install`
3. startup server-side api scritpt: `npm run server`
4. startup client web-service: `npm run client`
5. open browser and type url: _http://127.0.0.1:3001_

### How to use

paginate-autocomplete
```javascript
$(selector).paginatedAutocomplete({
    url: 'datasource.aspx',  // data-source url
    pageSize: 10, // Set PageSize    
    minLength: 0, // the word count for trigger ajax send 
    params: { // other post variables (null for none)
        param1: 'A', 
        param2: 'B',
        param3: function() { return 'C'; }
    },
    columns: {    //columns: Display as table mode (null for default)
        nationCode: { width: 100, header: 'Header1', align: 'center' },
        nationName: { width: 150, header: 'HEader2' },
        nationDesc: { width: 100 },
        // or assign value as a function...
        colfunc01: {
            width:100, header: 'Header Name',
            value: function(item) {
                return item.data.dataCode + '-' + item.data.dataName
            }
        },
        colfunc02: {
            width:100, header: 'Header Name',
            value: function(item) {
                return item.data.dataCode + '-' + item.data.dataCode
            }
        }
    },
    // On Change Event
    change: function (event, ui) {
    },
    // On Selected Event
    select: function(event, ui) {
    }
});
// Get Data
var data = $(selector).paginatedAutocomplete('data');

```

combobox-remote
```javascript
$(selector).comboboxRemote({
    url: 'datasource.aspx', // data-source url
    placeholder: 'Please input keyword...',
    params: { // other post variables (null for none)
        param1: 'A', 
        param2: 'B',
        param3: function() { return 'C'; }
    }      
    columns: {    //columns: Display as table mode (null for default)
        dataCode: { width: 100, header: 'Code', align: 'center' },
        dataName: { width: 150, header: 'Name' },
        dataDesc: { width: 100 },
        // or assign value as a function...
        colfunc: {
            width:100, header: 'Header Text',
            value: function(item) {
                return item.data.dataCode + '-' + item.data.dataName
            }
        }
    },    
    change: function (event, ui) { // On change event
        
    },
    select: function(event, ui) { // on selected event
    }
}
// set value and text
$(selector).comboboxRemote('value', [value], [displayText]);
var data = $(selector).comboboxRemote('data'); // get item.data properties
$(selector).comboboxRemote('setfocus'); // Set combobox focus
$(selector).comboboxRemote('setselected'); // Set combobox selected
```
