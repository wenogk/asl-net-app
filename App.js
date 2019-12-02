import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

//test
export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    letters: "",
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }



  takePicture = () => {
    if (this.camera) {
        this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
    }
 };

onPictureSaved = photo => {
  let uri = photo.uri
  let apiUrl = 'https://asl-net.herokuapp.com/';

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('the_file', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  fetch(apiUrl, options).then((resp)=>{ return resp.text() }).then((text)=>{
    console.log(text)

    let newLetters = this.state.letters;
    if(text=="space") { newLetters+=" ";}
    else if(text=="delete") {
      let temp = newLetters.split('')
      temp.pop()
      newLetters = temp.join('');}
    else if(text=="none") {
        newLetters += "-"
      } else {
        newLetters += text
      }

    this.setState(previousState => (
        { letters: newLetters  }
      ))

   });
}

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={(ref) => { this.camera = ref }}>

          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>

            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                backgroundColor: 'rgba(52, 52, 52, 0.8)',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({
                  type:
                    this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                });
              }}>
              <Text style={{fontSize: 18, marginBottom: 10, color: 'white' }}> {this.state.letters} </Text>
            </TouchableOpacity>
          </View>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>

              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',

                  backgroundColor: '#EDAE49',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  backgroundColor: '#00798C',
                  alignItems: 'center',
                }}
                onPress={this.takePicture}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Detect </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  backgroundColor: '#D1495B',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    letters: ""
                  });
                }}>
                <Text style={{fontSize: 18, marginBottom: 10, color: 'white' }}> Reset </Text>
              </TouchableOpacity>
            </View>

          </Camera>
        </View>
      );
    }
  }
}
