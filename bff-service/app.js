import axios from 'axios';
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
  const resp = req.originalUrl.split('/')[1];
  console.log(resp);

  const respUrl = process.env[resp];
  console.log(respUrl);

  if (respUrl) {
    const config = {
      method: req.method,
      url: `${respUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    };

    console.log(config);

    axios(config)
      .then((response) => {
        console.log(response);
        res.json(response.data);
      })
      .catch((error) => {
        console.log(error);

        if (error.response) {
          const { status, data } = error.response;
          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
});

app.listen(port, () => console.log(`Service is running on ${port}`));
