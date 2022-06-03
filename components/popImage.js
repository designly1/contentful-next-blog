/* popImage.js */

import React from "react";
import Swal from "sweetalert2";
import Image from "next/image";

export default class PopImage extends React.Component {
    state = {
        isOpen: false,
        winWidth: null
    };

    constructor(props) {
        super(props);

        // Fix contentful's image prefix
        if (this.props.src.match(/^\/\//)) {
            this.src = 'https:' + this.props.src;
        }else{
            this.src = this.props.src;
        }

        this.dialogTitle = (this.props.alt) ? this.props.alt : "Image";
    }

    componentDidMount() {
        this.setState({
            winWidth: window.innerWidth
        });
    }

    imgPop = () => {
        this.setState({ isOpen: !this.state.isOpen });

        Swal.fire({
            title: this.props.title,
            html: `
                <div style="display: flex; width:100%;">
                    <img src="${this.src}" alt="${this.props.alt}" className="${this.props.className}"
                        onClick="document.querySelector('.swal2-confirm').click()" style="margin: auto; width:100%;" />
                </div>
            `,
            confirmButtonText: "CLOSE",
            width: '100%',
            backdrop: 'black',
            background: 'black',
            padding: '1px',
            margin: '1px',
            loaderHtml: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="translate(26.666666666666668,26.666666666666668)">
              <rect x="-20" y="-20" width="40" height="40" fill="#93dbe9">
                <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.3s"></animateTransform>
              </rect>
            </g>
            <g transform="translate(73.33333333333333,26.666666666666668)">
              <rect x="-20" y="-20" width="40" height="40" fill="#689cc5">
                <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.2s"></animateTransform>
              </rect>
            </g>
            <g transform="translate(26.666666666666668,73.33333333333333)">
              <rect x="-20" y="-20" width="40" height="40" fill="#5e6fa3">
                <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="0s"></animateTransform>
              </rect>
            </g>
            <g transform="translate(73.33333333333333,73.33333333333333)">
              <rect x="-20" y="-20" width="40" height="40" fill="#3b4368">
                <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.1s"></animateTransform>
              </rect>
            </g>
            <!-- [ldio] generated by https://loading.io/ --></svg>`
        });
    };

    render() {
        return (
            <Image
                {...this.props}
                className="pop-image"
                src={this.src}
                onClick={this.imgPop}
                alt={this.props.alt}
                width={1920}
                height={1080}
            />
        );
    }
}