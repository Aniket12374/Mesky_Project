import Button from "../Common/Button";

const AgentCreation = () => {
  return (
    <div>
      <div className="flex justify-end">
        <Button btnName={"Save"} />
        <Button btnName={"Cancel"} />
      </div>
      <div className="flex space-x-5 w-full justify-start">
        <div className="w-[40%] space-y-2">
          <div className="">
            <label>Full Name</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg  shadow-inner shadow-fuchsia-400"
              //   placeholder="Warehouse Name"
            />
          </div>
          <div className="">
            <label>Phone Number</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg  shadow-inner shadow-fuchsia-400"
              //   placeholder="Warehouse Name"
            />
          </div>
        </div>
        <div className="w-[40%]">
          <label>Assigned Area</label>
          <input
            type="text"
            className="w-full h-32 rounded-lg  shadow-inner shadow-fuchsia-400"
            // placeholder="Warehouse Name"
          />
        </div>
      </div>
      <div>
        <div className="font-bold text-2xl">Documents</div>
        <div className="flex justify-evenly w-full">
          <div className="w-1/2 flex justify-evenly">
            <div className="space-y-4">
              <div className="text-lg font-medium">TYPE</div>
              <div>Driving License</div>
              <div>Aadhaar Card</div>
              <div>Vehicle Name Plate Image</div>
              <div>Vehicle RC</div>
              <div>Vehicle Insurance</div>
              <div>Vehicle (PUC) Pollution Check</div>
            </div>
            <div className="space-y-3">
              <div className="text-lg font-medium">DOCUMENT</div>

              <div>
                <input
                  type="file"
                  id="driving-license"
                  name="driving-license"
                />
              </div>
              <div>
                <input type="file" id="aadhar-card" name="aadhar-card" />
              </div>
              <div>
                <input
                  type="file"
                  id="vehicle-name-plate"
                  name="vehicle-name-plate"
                />
              </div>
              <div>
                <input type="file" id="vehicle-rc" name="vehicle-rc" />
              </div>
              <div>
                <input
                  type="file"
                  id="vehicle-insurance"
                  name="vehicle-insurance"
                />
              </div>
              <div>
                <input type="file" id="vehicle-puc" name="vehicle-puc" />
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-evenly">
            <div className="space-y-4">
              <div className="text-lg font-medium">ISSUE DATE</div>
              <div>24-MAR-2018</div>
              <div>24-MAR-2018</div>
              <div>24-MAR-2018</div>
              <div>24-MAR-2018</div>
              <div>24-MAR-2018</div>
              <div>24-MAR-2018</div>
            </div>
            <div className="space-y-4">
              <div className="text-lg font-medium">EXPIRY DATE</div>
              <div>18-JUL-2028</div>
              <div>18-JUL-2028</div>
              <div>18-JUL-2028</div>
              <div>18-JUL-2028</div>
              <div>18-JUL-2028</div>
              <div>18-JUL-2028</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCreation;
