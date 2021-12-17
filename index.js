import express from 'express';
const app = express();
import redis from 'redis';
const client = redis.createClient();

// // ---Single Value Write and Read
// client.set("my_key", "Hellow World!");
// client.get("my_key", function(err, reply) {
//     console.log(reply)
// })

// --- Multiple value write and read (Initial Values)
client.mset('header',0,'left',0,'article',0,'right',0,'footer',0,);
client.mget(['header','left','article','right','footer'],
    function(err, value) {
        console.log(value);
    }
)

const data = () => {
    return new Promise((resolve, reject) => {
        client.mget(['header','left','article','right','footer'],
            function(err, value) {
                const data = {
                    'header': Number(value[0]),
                    'left': Number(value[1]),
                    'article': Number(value[2]),
                    'right': Number(value[3]),
                    'footer': Number(value[4]),
                };

                err ? reject(null) : resolve(data)
            }
        )
    })
}

app.use(express.static('public'))

//get data
app.get('/data', (req, res) => {
    data()
        .then(data => {
            console.log(data);
            res.send(data);
    })
});


//update data
app.get('/update/:key/:value', (req, res) => {
    const key = req.params.key
    let value = Number(req.params.value);
    client.get(key, function(err, reply){
        value = Number(reply) + value;
        client.set(key, value);

        data()
            .then(data => {
                console.log(data);
                res.send(data)
            })
    })
})




const port = 4545;
app.listen(port, (req, res) => {
    console.log(`Redis and Express created this Holy Grail on Port ${port}`)
})