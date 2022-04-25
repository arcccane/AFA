$('#sub').on('change', function () {
	let image = $("#sub")[0].files[0];
	let formdata = new FormData();
	formdata.append('sub', image);
	$.ajax({
		url: '/content/upload',
		type: 'POST',
		data: formdata,
		contentType: false,
		processData: false,
		'success': (data) => {
			$('#subpic').attr('src', data.file);
			$('#subURL').attr('value', data.file);
			if (data.err) {
				$('#subErr').show();
				$('#subErr').text(data.err.message);
			} else {
				$('#subErr').hide();
			}
		}
	});
});
$('#posterUpload').on('change', function(){
    console.log('test');
    let image = $("#posterUpload")[0].files[0];
    let formdata = new FormData();
    formdata.append('posterUpload', image);
    $.ajax({
    url: '/event/upload',
    type: 'POST',
    data: formdata,
    contentType: false,
    processData: false,
    'success':(data) => {
    $('#poster').attr('src', data.file);
    $('#posterURL').attr('value', data.file);// sets posterURL hidden field
    if(data.err){
    $('#posterErr').show();
    $('#posterErr').text(data.err.message);
    } else{
    $('#posterErr').hide();
    }
    }
    });
    });

    
    $('#imageUpload').on('change', function(){
        let image = $("#imageUpload")[0].files[0];
        let formdata = new FormData();
        formdata.append('imageUpload', image);
        $.ajax({
        url: '/product/upload',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        'success':(data) => {
        $('#image').attr('src', data.file);
        $('#imageURL').attr('value', data.file);// sets posterURL hidden field
        if(data.err){
        $('#imageErr').show();
        $('#imageErr').text(data.err.message);
        } else{
        $('#imageErr').hide();
        }
        }
        });
        });

