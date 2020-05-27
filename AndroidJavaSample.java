// ## All code by Yoni Harris ##

// Description: The activities build UI for native app to scan RFID UHF
// passive tags with Android dedicated device. Once the tags are scanned the data is sent
// securely to web app (AWS RDS DB).

public class MainActivity extends AppCompatActivity {

    // local vars
    TextView mCount, mReaderStatus, mNetworkStatus, mTextHeader;
    ImageView mImageReaderStatus, mImageNetworkStatus, mReset, mResetZone, mResetSubzone, mResetItem;
    String mEpc, mReaderStatusValue, mReaderColor = "#FFFFFF";
    AutoCompleteTextView mAcLocation, mAcAddress, mAcItem, mAcStatus;
    Button mSend;
    Switch mSwitchZone, mSwitchSubzone, mSwitchStatus, mSwitchItem;
    ToggleButton mToggleZone, mToggleSubzone, mToggleStatus, mToggleItem, mToggleNewTag;
    ArrayList<String> mArrayLocations = new ArrayList<String>();
    ArrayList<String> mArrayAddress = new ArrayList<String>();
    ArrayList<String> mArrayItems = new ArrayList<String>();
    ArrayList<String> mArrayStatus = new ArrayList<String>();
    JSONObject tagJson = new JSONObject();
    int mCountSize=0;

    ArrayList<String> epcList = new ArrayList<>();
    ArrayList<String> tagList = new ArrayList<>();
    ArrayList<String> itemList = new ArrayList<>();
    ArrayList<String> zoneList = new ArrayList<>();
    ArrayList<String> subzoneList = new ArrayList<>();

    // radio buttons
    RadioGroup mRadioLocationGroup;
    RadioButton mRadioGeneral, mRadioWarehouse, mRadioLaundry;

    // db vars
    DbHandler db;

    // set username
    String mUsername;

    // custom adapter
    private static CustomAdapter listAdapter;

    // RFID model vars
    ModuleConnector connector = new ReaderConnector();
    RFIDReaderHelper mReaderHelper;

    protected void onCreate(Bundle savedInstanceState) {

        // create main class
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // open login activity
        Intent loginIntent = new Intent(this, LoginActivity.class);
        startActivityForResult(loginIntent, 1);

        // set status text
        mReaderStatus = findViewById(R.id.TxtReaderStatus);
        mNetworkStatus = findViewById(R.id.TxtNetworkStatus);

        // header text
        mTextHeader = findViewById(R.id.textHeader);

        // set send date, count tags, close app
        mCount = findViewById(R.id.textTagCount);
        mSend = findViewById(R.id.buttonSend);
        mReset = findViewById(R.id.buttonReset);

        // set image status
        mImageReaderStatus = findViewById(R.id.ImageReaderStatus);
        mImageNetworkStatus = findViewById(R.id.ImageNetworkStatus);

        // set image reset inputs
        mResetZone = findViewById(R.id.resetZone);
        mResetSubzone = findViewById(R.id.resetSubzone);
        mResetItem = findViewById(R.id.resetItem);

        // set switches
        mSwitchZone = findViewById(R.id.switchZone);
        mSwitchSubzone = findViewById(R.id.switchSubzone);
        mSwitchStatus = findViewById(R.id.switchStatus);
        mSwitchItem = findViewById(R.id.switchItem);

        // set toggles
        mToggleZone = findViewById(R.id.toggleZone);
        mToggleSubzone = findViewById(R.id.toggleSubzone);
        mToggleStatus = findViewById(R.id.toggleStatus);
        mToggleItem = findViewById(R.id.toggleItem);
        mToggleNewTag = findViewById(R.id.toggleNewTag);

        // set data for tag scanned list and initialize listAdapter
        listAdapter = new CustomAdapter(MainActivity.this, itemList, zoneList, subzoneList);

        // create new db handler in order to read db data
        db = new DbHandler(MainActivity.this);

        // ## TOGGLES ##

        mToggleZone.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            if (isChecked) {

                String[] tagsEpc = db.getTagsEpcByZone(mAcLocation.getText().toString());

                // remove epc
                for (int i=0; i < tagsEpc.length; i++){
                    removeScanEpcToList(tagsEpc[i]);
                }

                mCountSize = epcList.size();

                runOnUiThread(new Runnable() {
                    public void run() {
                        // notify listAdapter
                        listAdapter.notifyDataSetChanged();
                        updateUI();
                    }
                });

            }
            }
        });
