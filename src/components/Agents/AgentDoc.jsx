import React from "react";
import FileAction from "../shared/FileAction";
import moment from "moment";
import { DatePicker } from "antd";

function AgentDoc({
  formData,
  setFormData,
  handleInputChange,
  handleDateChange,
  isDisable,
}) {
  return (
    <div>
      <div>
        {/* Aadhar details */}
        <div>
          <p className="font-bold pb-1">Enter Aadhar Details</p>
          <div className="flex space-x-2">
            <input
              className="py-3 px-2 w-52 border border-gray rounded-md h-12"
              placeholder="Enter your Aadhar Number"
              name="aadharNumber"
              value={formData?.aadharNumber}
              onChange={handleInputChange}
              disabled={isDisable}
            />
            <FileAction
              name="Upload Aadhar Front JPG/PDF"
              upload={true}
              display={true}
              fileKey="aadharFront"
              fileState={formData?.aadharFront}
              setFormData={setFormData}
              download={true}
            />
            <FileAction
              name="Upload Aadhar Back JPG/PDF"
              upload={true}
              display={true}
              fileKey="aadharBack"
              fileState={formData?.aadharBack}
              setFormData={setFormData}
              download={true}
            />
          </div>
        </div>

        {/* Driving License details */}
        <div>
          <p className="font-bold pb-1">Driving License Details</p>
          <div className="flex space-x-2">
            <input
              className="py-3 px-2 w-52 border border-gray rounded-md h-12"
              placeholder="Enter Driving License Number"
              name="drivingLicenseNumber"
              value={formData?.drivingLicenseNumber}
              onChange={handleInputChange}
              disabled={isDisable}
            />
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Enter Expiry Date"
              allowClear={false}
              className="h-12 w-48"
              value={
                formData.drivingLicenseExpiry
                  ? moment(formData.drivingLicenseExpiry, "DD-MM-YYYY")
                  : null
              }
              onChange={(date) =>
                handleDateChange("drivingLicenseExpiry", date)
              }
              disabled={isDisable}
            />
            <FileAction
              name="Upload DL with expiry date Visible JPG/PDF"
              upload={true}
              display={true}
              fileKey="drivingLicenseFile"
              fileState={formData?.drivingLicenseFile}
              setFormData={setFormData}
              download={true}
            />
          </div>
        </div>

        {/* Insurance details */}
        <div>
          <p className="font-bold pb-1">Insurance Details</p>
          <div className="flex space-x-2">
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Enter Expiry Date"
              allowClear={false}
              className="h-12 w-52"
              value={moment(formData?.insuranceExpiry, "DD-MM-YYYY")}
              onChange={(date) => handleDateChange("insuranceExpiry", date)}
              disabled={isDisable}
            />
            <FileAction
              name="Upload 2-wheeler insurance (JPG/PDF)"
              upload={true}
              display={true}
              fileKey="insuranceFile"
              fileState={formData?.insuranceFile}
              setFormData={setFormData}
              download={true}
            />
          </div>
        </div>

        {/* Registration details */}
        <div>
          <p className="font-bold pb-1">Registration Details</p>
          <div className="flex space-x-2">
            <input
              className="py-3 px-2 w-52 border border-gray rounded-md h-12"
              placeholder="Enter Vehicle RC Number"
              name="rcNumber"
              value={formData?.rcNumber}
              onChange={handleInputChange}
              disabled={isDisable}
            />
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Enter Expiry Date"
              allowClear={false}
              className="h-12 w-48"
              value={moment(formData?.rcExpiry, "DD-MM-YYYY")}
              onChange={(date) => handleDateChange("rcExpiry", date)}
              disabled={isDisable}
            />
            <FileAction
              name="Upload Vehicle Registration Certificate (JPG/PDF)"
              upload={true}
              display={true}
              fileKey="rcFile"
              fileState={formData?.rcFile}
              setFormData={setFormData}
              download={true}
            />
            <FileAction
              name="Upload Vehicle Picture with Number Visible (JPG/PDF)"
              upload={true}
              display={true}
              fileKey="rcVehiclePicture"
              fileState={formData?.rcVehiclePicture}
              setFormData={setFormData}
              download={true}
            />
          </div>
        </div>

        {/* PAN details */}
        <div>
          <p className="font-bold pb-1">PAN Details</p>
          <div className="flex space-x-2">
            <input
              className="py-3 px-2 w-52 border border-gray rounded-md h-12"
              placeholder="Enter PAN Number"
              name="panNumber"
              value={formData?.panNumber}
              onChange={handleInputChange}
              disabled={isDisable}
            />
            <FileAction
              name="Upload PAN Card (JPG/PDF)"
              upload={true}
              display={true}
              fileKey="panFile"
              fileState={formData?.panFile}
              setFormData={setFormData}
              download={true}
            />
          </div>
        </div>

        {/* Pollution Check details */}
        <div>
          <p className="font-bold pb-1">Pollution Check Details</p>
          <div className="flex space-x-2">
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Enter Expiry Date"
              allowClear={false}
              className="h-12 w-52"
              value={moment(formData?.pollutionCheckExpiry, "DD-MM-YYYY")}
              onChange={(date) =>
                handleDateChange("pollutionCheckExpiry", date)
              }
              disabled={isDisable}
            />
            <FileAction
              name="Upload Vehicle PUC Check (JPG/PDF)"
              upload={true}
              display={true}
              fileKey="pollutionCheckFile"
              fileState={formData?.pollutionCheckFile}
              setFormData={setFormData}
              download={true}
            />
          </div>
        </div>

        {/* Bank Passbook/Cancelled Cheque */}
        <div>
          <p className="font-bold pb-1">Bank Passbook/Cancelled Cheque</p>
          <FileAction
            name="Passbook/Cancelled Cheque (JPG/PDF)"
            upload={true}
            display={true}
            fileKey="bankPassbookCheque"
            fileState={formData?.bankPassbookCheque}
            setFormData={setFormData}
            download={true}
          />
        </div>
      </div>
    </div>
  );
}

export default AgentDoc;
