import React, { forwardRef, useRef, Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";
import { Grid, MenuItem, Card, CardContent, Checkbox } from "@material-ui/core";
import {
  Map,
  GoogleMap,
  GoogleApiWrapper,
  Marker,
  InfoWindow,
  MarkerClusterer,
  MapWrapper,
} from "google-maps-react";

import * as Service from "../services/Service.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { Button } from "reactstrap";

const GMap = ({ ...props }) => {
  console.log("propssssssssssssssssssss: ", props);

  const mapStyles = {
    width: "90%",
    height: "80%",
    overflow: "hidden !important",
  };

  const { useState } = React;
  // const DispensingLanguage = JSON.parse(
  //   localStorage.getItem("DispensingLanguage")
  // );
  // const lan = localStorage.getItem("LangCode");
  // const menukey = "facility";
  const classes = useStyles();

  const [loaded, setLoaded] = useState(false);

  const [state, setState] = useState({
    showingInfoWindow: true,
    activeMarker: {},
    selectedPlace: {},
    markerParams: {},
  });

  const fitBounds = (map) => {
    console.log("jbhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    const bounds = new window.google.maps.LatLngBounds();

    map.fitBounds(bounds);
  };
  const loadHandler = (map) => {
    console.log("jbhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    fitBounds(map);
  };

  const onMarkerClick = (props, marker, e) => {
    console.log("onMarkerClick onMarkerClick props",props.params);
    // console.log("onMarkerClick onMarkerClick marker",marker);
    // console.log("onMarkerClick onMarkerClick e",e);
    setState({
      selectedPlace: props,
      markerParams: props.params,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  const onClose = (props) => {
    if (state.showingInfoWindow) {
      setState({
        selectedPlace: {},
        showingInfoWindow: false,
        activeMarker: null,
        markerParams: {},
      });
    }
  };
  function createKey(location) {
    return location.lat + location.lng;
  }

  // const changeMarkerPosition =(e)=>{

  //  // alert("vhs")
  //   console.log('e: ', e);

  //   // this.setState({
  //   // ...this.state,
  //   //   details:{
  //   //     ...this.state.details,
  //   //     lat:e.lat,
  //   //     lng:e.lng
  //   //   }
  //   // })
  // }

  // const onMarkerDragEnd = evt => {

  //   let newLat = evt.latLng.lat(),

  // 	    newLng = evt.latLng.lng();
  //       console.log('newLat: ', newLat+'+++++++++++'+newLng);

  //   console.log('6666: ',evt);
  //  // console.log('888888888888888888: ',evt.onDragend.onMarkerDragEnd());
  //   //props.formData['location']=evt.position.lat+','+evt.position.lng;
  //  // props.updateLatLang(evt.position.lat,evt.position.lng);
  //  // props.latlng=[evt.position.lat,evt.position.lng];
  //   console.log('6666: ', evt.position);
  //  // console.log(evt.google.maps.Marker.getPosition().lat());
  // };

  //   const onMarkerDragEndss = (coord, index) => {
  //     console.log('coord: ', coord);
  //     const { latLng } = coord;
  //     const lat = latLng.lat();
  //     const lng = latLng.lng();
  // return;
  //     this.setState(prevState => {
  //       const markers = [...this.state.markers];
  //       markers[index] = { ...markers[index], position: { lat, lng } };
  //       return { markers };
  //     });
  //   };

  const options = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png", // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  };

  return (
    <>
      <Map
        google={props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={{
          lat: 23.86255968977096,
          lng: 90.33998265335906
        }}
        // center={
        //   {
        //     lat: 23.73180007001292,
        //    lng: 90.42627216534802
        //     // lat: props.formData.Latitude,
        //     // lng: props.formData.Longitude
        //   }
        // }
        // draggable={true}
        // onClick = {changeMarkerPosition}
      >
        {/* {
                   props.addProductForm?(
                      <Marker
                         
                        ref={refmap => refmap}
                        params={props.formData}
                        position={{ lat:props.latlng[0], lng:  props.latlng[1] }}
                        onClick={onMarkerClick}
                        // draggable={true}
                        // onDragend={(t, map, coord) => {
                          
                        //   console.log('dragEnd', coord.latLng.lng() )


                        //    props.formData['location']=coord.latLng.lat()+','+coord.latLng.lng();
                        //     props.updateLatLang(coord.latLng.lat(),coord.latLng.lng());
                        //     props.latlng=[coord.latLng.lat(),coord.latLng.lng()];

                        
                        // }}
                        // params={props.formData} 
             
                        icon={{
                          url: require("assets/img/marker_icon.png")  , 
                  
                      }}
                  
                      />):( */}

        {props.formData.map((item, index) => {
          return (
            <Marker
              ref={(refmap) => refmap}
              position={{ lat: item.Latitute, lng: item.Longitute }}
              onClick={onMarkerClick}
              params={item}
              icon={{
                url: require("assets/img/marker_icon.png"),
              }}
            />
          );
        })}

        {/* <Marker
          ref={(refmap) => refmap}
          // params={props.formData}
          // position={{ lat:props.formData.Latitude, lng:  props.formData.Longitude }}
          position={{ lat: 23.73180007001292, lng: 90.42627216534802 }}
          onClick={onMarkerClick}
          // draggable={true}

          // onDragend={(t, map, coord) => {

          //   console.log('dragEnd', coord.latLng.lng() )

          //     props.formData['location']=coord.latLng.lat()+','+coord.latLng.lng();
          //     props.updateLatLang(coord.latLng.lat(),coord.latLng.lng());
          //     props.latlng=[coord.latLng.lat(),coord.latLng.lng()];
          //     props.formData.Latitude = coord.latLng.lat();
          //     props.formData.Longitude = coord.latLng.lng();

          // }}

          // params={props.formData}

          icon={{
            url: require("assets/img/marker_icon.png"),
          }}
        /> */}

        {/* ) */}

        {/* // } */}

        {  
                  
                  
      <InfoWindow
          marker={state.activeMarker}
          visible={state.showingInfoWindow}
          onClose={onClose}
        >
          <div>

          <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                              <TableBody>
                                <TableRow>
                                  <TableCell
                                    style={{
                                      "fontWeight": "bold",
                                      "borderRight": "1px solid antiquewhite",
                                    }}
                                  >
                                  {"Division"}
                                  </TableCell>
                                  <TableCell >
                                  {state.markerParams.DivisionName}
                                  </TableCell>
                                  </TableRow>
                                  <TableRow>
                                  <TableCell
                                    style={{
                                      "fontWeight": "bold",
                                      "borderRight": "1px solid antiquewhite",
                                    }}
                                    align="left"
                                  >
                                   {"District"}
                                  </TableCell>
                                  
                                  <TableCell > {state.markerParams.DistrictName}  </TableCell>
                                  </TableRow>
                                  <TableRow>
                                  <TableCell
                                    style={{
                                      "fontWeight": "bold",
                                      "borderRight": "1px solid antiquewhite",
                                    }}
                                    align="left"
                                  >
                                   {"Upazila"}
                                  </TableCell>
                                  <TableCell >  {state.markerParams.UpazilaName} </TableCell>
                                  </TableRow>
                                  <TableRow>
                                  <TableCell
                                    style={{
                                      "fontWeight": "bold",
                                      "borderRight": "1px solid antiquewhite",
                                    }}
                                  >
                                  {"Union" }
                                  </TableCell>
                                  <TableCell > {state.markerParams.UnionName} </TableCell>
                                   
                                </TableRow>

                                <TableRow>
                                <TableCell
                                    style={{
                                      "fontWeight": "bold",
                                      "borderRight": "1px solid antiquewhite",
                                    }}
                                  >
                                  {"Farmer" }
                                  </TableCell>
                                  <TableCell > {state.markerParams.FarmerName} </TableCell>
                                   
                                </TableRow>

                                <TableRow>
                                <TableCell
                                    style={{
                                      "fontWeight": "bold",
                                      "borderRight": "1px solid antiquewhite",
                                    }}
                                  >
                                  {"Gender"}
                                  </TableCell>
                                  <TableCell > {state.markerParams.GenderName} </TableCell>
                                   
                                </TableRow>

                                <TableRow>
                                <TableCell
                                    style={{
                                      "fontWeight": "bold",
                                      "borderRight": "1px solid antiquewhite",
                                    }}
                                  >
                                  {"Phone"}
                                  </TableCell>
                                  <TableCell > {state.markerParams.Phone} </TableCell>
                                   
                                </TableRow>


                      

                              </TableBody>
                             
                            </Table>
                          </TableContainer>

           
          </div>
        </InfoWindow> }
      </Map>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCD7OEdGUC1V__0-mBJIoYifI5UtEILYbg",
})(GMap);
//export default FacilityMap;

const useStyles = makeStyles({
  // facilityPageTitle: {
  //   marginTop: "60px",
  //   color: "white",
  //   background: "whitesmoke",
  //   color: "black",
  //   borderRadius: "10px",
  //   padding: "1rem",
  // },
  // tableContainer: {
  //   backgroundColor: "whitesmoke",
  //   borderRadius: "10px",
  //   padding: "2rem",
  //   color: "black",
  // },
  // fullWidth: {
  //   width: "95%",
  // },
  // filterDiv: {
  //   width: "80%",
  //   display: "flex",
  // },
});
