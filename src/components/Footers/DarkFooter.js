/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

function DarkFooter() {
  return (
    <footer className="footer" data-background-color="black">
      <Container>
        <nav>
          <ul>
              {/* <li>
                <a href="#" target="_blank" className="text-capitalize">
                Benin SVDL
                </a>
              </li> */}
          </ul>
        </nav>
        {/* <div className="copyright" id="copyright">
          © {new Date().getFullYear()},{" "}
          <a
          // href=""
          // target="_blank"
          >
            Supported by DFDMS
          </a>
        </div> */}

        <div class="footer">
            <h6>Powered By LDDP, DLS. &#169; Department of Livestock Services :Developed by Big O Solution</h6>
        </div>
      </Container>
    </footer>
  );
}

export default DarkFooter;
