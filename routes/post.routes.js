const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const router = express.Router();

const verifyUser = async (req, res, next) => {
	try {
		// receive token and extract it
		const token = req.headers.authorization.split(" ")[1];
		// verify the token using jwt
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		// get the user from the database
		const user = await prisma.user.findUnique({
			where: { email: payload.email },
		});
		req.user = user;
		// append the user to the request object
		next();
	} catch (err) {
		next(err);
	}
};

//posts
router.get("/", async (req, res) => {
	const posts = await prisma.post.findMany({
		include: {
			author: {
				select: {
					id: true,
					name: true,
					email: true,
				},

			},

			comments: {
				select: {
					id: true,
					content: true,
				},

			},
		},
	});
	res.send(posts);
});
router.post("/", verifyUser, async (req, res) => {
	const { title, content } = req.body;
	const post = await prisma.post.create({
		data: {
			title,
			content,
			authorId: req.user.id,
		},
	});
	res.send(post);
});

router.get("/:id", async (req, res) => {
	const post = await prisma.post.findFirst({
		include: {
			author: {
				select: {
					id: true,
					name: true,
					email: true,
				},

			},

			comments: {
				select: {
					id: true,
					content: true,
				},

			},
		},
	});
	res.send(post);
});


router.patch("/:id", verifyUser, async (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body;

	try {
		const existPost = await prisma.post.findUnique({
			where: { id: parseInt(id) }
		});

		if (!existPost) {
			return res.status(500).json({ message: "Post not found" });
		}

		const updatedPost = await prisma.post.update({
			where: { id: parseInt(id) },
			data: {
				title,
				content,
			},
		});
		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});



router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const existingPost = await prisma.post.findUnique({
			where: { id: parseInt(id) }
		});
		if (!existingPost) {
			return res.status(500).json({ message: "Post not found" });
		}

		await prisma.post.delete({
			where: { id: parseInt(id) }
		});
		res.status(200).json({ message: 'Post Deleted Success' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
